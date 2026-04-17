"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Clock, Stars, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { FormSelect } from '../ui/FormSelect';
import { FormTextArea } from '../ui/FormTextArea';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppointmentCreateSchema, AppointmentFormValues } from '@/lib/validations/appointment.schema';
import { useServices } from '@/hooks/useServices';
import { useClients } from '@/hooks/useClients';
import { useCreateAppointment, useUpdateAppointment, useDeleteAppointment } from '@/hooks/useAppointments';

interface AppointmentFormProps {
    initialData?: any;
    isEdit?: boolean;
    prefill?: {
        startsAt?: string; // Expects HH:mm
        staffId?: string;
    };
    calendarDate?: string; // The active date on the calendar (YYYY-MM-DD)
    staffList: any[]; 
    onClose: () => void;
}

export default function AppointmentForm({
    initialData,
    isEdit = false,
    prefill,
    calendarDate = new Date().toISOString().split('T')[0],
    staffList,
    onClose
}: AppointmentFormProps) {
    // 1. Hook Integrations
    const { data: servicesData, isLoading: isLoadingServices } = useServices();
    const { data: clientsData, isLoading: isLoadingClients } = useClients({ limit: 100 });
    const createMutation = useCreateAppointment();
    const updateMutation = useUpdateAppointment();
    const deleteMutation = useDeleteAppointment();

    // 2. Form Initialization
    const defaultValues: any = useMemo(() => {
        if (isEdit && initialData) {
            const startDate = new Date(initialData.starts_at);
            const endDate = new Date(initialData.ends_at);
            const duration = Math.round((endDate.getTime() - startDate.getTime()) / 60000);
            
            return {
                clientId: initialData.client_id,
                serviceId: initialData.service_id,
                staffId: initialData.staff_id,
                branchId: initialData.branch_id,
                startsAt: initialData.starts_at,
                endsAt: initialData.ends_at,
                status: initialData.status,
                notes: initialData.notes || '',
                startTime: `${startDate.getHours().toString().padStart(2, '0')}:${startDate.getMinutes().toString().padStart(2, '0')}`,
                duration: duration
            };
        }

        return {
            clientId: '',
            serviceId: '',
            staffId: prefill?.staffId || '',
            branchId: staffList.find(s => s.id === prefill?.staffId)?.branch_id || staffList[0]?.branch_id || null,
            startTime: prefill?.startsAt || '',
            duration: 60,
            status: 'booked',
            notes: '',
            startsAt: null, // Will be synced
            endsAt: null
        };
    }, [initialData, isEdit, prefill, staffList]);

    const methods = useForm<any>({
        resolver: zodResolver(AppointmentCreateSchema),
        defaultValues
    });

    const { watch, setValue, register, handleSubmit, reset, formState: { errors } } = methods;

    // Force form reset when defaults (async data) are ready
    useEffect(() => {
        reset(defaultValues);
    }, [defaultValues, reset]);

    // Debug: Log validation errors in real-time
    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            console.group('❌ Form Validation Errors');
            console.table(errors);
            console.groupEnd();
        }
    }, [errors]);
    
    // Watch fields for real-time synchronization
    const startTime = watch('startTime');
    const duration = watch('duration');
    const serviceId = watch('serviceId');
    const staffId = watch('staffId');

    // 3. Synchronization Effects
    
    // Sync StartsAt whenever startTime or calendarDate changes
    useEffect(() => {
        if (!startTime || !calendarDate) return;
        const [h, m] = startTime.split(':');
        const d = new Date(calendarDate);
        d.setHours(parseInt(h), parseInt(m), 0, 0);
        setValue('startsAt', d.toISOString());
    }, [startTime, calendarDate, setValue]);

    // Sync EndsAt based on StartsAt and Duration
    const currentStartsAt = watch('startsAt');
    useEffect(() => {
        if (!currentStartsAt || !duration) return;
        const d = new Date(currentStartsAt);
        d.setMinutes(d.getMinutes() + parseInt(duration));
        setValue('endsAt', d.toISOString());
    }, [currentStartsAt, duration, setValue]);

    // Auto-sync branchId when staffId changes
    useEffect(() => {
        const staff = staffList.find(s => s.id === staffId);
        console.group('🛠️ AppointmentForm: Branch Sync');
        console.log('Selected Staff ID:', staffId);
        if (staff) {
            console.log('Staff Found:', `${staff.users?.first_name} ${staff.users?.last_name}`);
            console.log('Detected Branch ID:', staff.branch_id);
            if (staff.branch_id) {
                setValue('branchId', staff.branch_id);
            } else {
                console.warn('⚠️ Warning: Selected staff has no branch_id!');
                setValue('branchId', null);
            }
        } else {
            console.log('No staff found for this ID (might be initializing)');
            setValue('branchId', null);
        }
        console.groupEnd();
    }, [staffId, staffList, setValue]);

    // Auto-fill duration when service changes
    useEffect(() => {
        const selectedService = servicesData?.data.find(s => s.id === serviceId);
        if (selectedService) {
            console.group('✨ AppointmentForm: Service Auto-Fill');
            console.log('Selected Service:', selectedService.name);
            console.log('Default Duration:', selectedService.duration_mins, 'min');
            
            // We set the duration strictly from the service whenever it changes
            setValue('duration', selectedService.duration_mins || 60);
            console.groupEnd();
        }
    }, [serviceId, servicesData, setValue]);

    // Display formatted end time for UI
    const endsAtDisplay = useMemo(() => {
        const endsAt = watch('endsAt');
        if (!endsAt) return '--:--';
        const d = new Date(endsAt);
        return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
    }, [watch('endsAt')]);

    // 4. Submission Handler
    const onSubmit = async (data: any) => {
        console.group('🚀 AppointmentForm: SUBMITTING');
        console.log('Raw Form Data:', data);
        
        // Final sanity check on UUID format before mutation
        const isUUID = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
        
        const payloadCheck = {
            clientId: { val: data.clientId, ok: isUUID(data.clientId) },
            staffId: { val: data.staffId, ok: isUUID(data.staffId) },
            serviceId: { val: data.serviceId, ok: isUUID(data.serviceId) },
            branchId: { val: data.branchId, ok: isUUID(data.branchId || '') }
        };
        console.table(payloadCheck);
        console.groupEnd();

        try {
            if (isEdit) {
                await updateMutation.mutateAsync({ id: initialData.id, data });
            } else {
                await createMutation.mutateAsync(data);
            }
            onClose();
        } catch (e) {
            console.error('❌ Mutation Failed:', e);
        }
    };

    const isPending = createMutation.isPending || updateMutation.isPending;
    const mutationError = (createMutation.error || updateMutation.error) as any;

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
                {/* Section 1: Client Selection */}
                <section>
                    <div className="flex justify-between items-end mb-4">
                        <label className="text-[0.65rem] uppercase tracking-widest text-on-surface-variant font-bold">Client</label>
                        <button type="button" className="text-[0.7rem] font-semibold text-secondary hover:underline">+ Add New</button>
                    </div>
                    <FormSelect
                        name="clientId"
                        placeholderText={isLoadingClients ? "Loading clients..." : "Select Client"}
                        options={clientsData?.data.map(c => ({
                            label: `${c.first_name} ${c.last_name}`,
                            value: c.id
                        })) || []}
                    />
                </section>

                {/* Section 2: Service & Staff */}
                <section className="grid grid-cols-2 gap-6">
                    <FormSelect
                        name="serviceId"
                        label="Service"
                        placeholderText={isLoadingServices ? "Loading services..." : "Select Service"}
                        options={servicesData?.data.map(s => ({
                            label: s.name || '',
                            value: s.id
                        })) || []}
                    />

                    <FormSelect
                        name="staffId"
                        label="Staff member"
                        placeholderText="Select Staff"
                        options={staffList.map(s => ({
                            label: `${s.users?.first_name} ${s.users?.last_name}`,
                            value: s.id
                        }))}
                    />
                </section>

                {/* Section 3: Time Selection */}
                <section className="bg-surface-container-low/50 rounded-xl p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[0.65rem] uppercase tracking-widest text-on-surface-variant font-bold">Start Time</label>
                            <div className="flex items-center gap-2 pb-2 border-b border-outline-variant/30">
                                <Clock className="text-on-surface-variant/60" size={18} />
                                <input
                                    className="bg-transparent border-none focus:ring-0 p-0 text-sm font-medium w-full accent-secondary text-on-surface"
                                    type="time"
                                    {...register('startTime')}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[0.65rem] uppercase tracking-widest text-on-surface-variant font-bold">Ends At</label>
                            <div className="flex items-center gap-1.5 pb-2 border-b border-transparent">
                                <span className="text-sm font-semibold text-primary">{endsAtDisplay}</span>
                                <span className="text-[0.65rem] text-on-surface-variant/50 font-medium">(Auto)</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[0.65rem] uppercase tracking-widest text-on-surface-variant font-bold">Duration (Minutes)</label>
                        <div className="flex gap-2">
                            {[30, 45, 60, 90, 120].map((opt) => (
                                <button
                                    key={opt}
                                    type="button"
                                    onClick={() => setValue('duration', opt)}
                                    className={`flex-1 py-2 text-xs font-semibold rounded-full transition-all border ${parseInt(duration) === opt
                                        ? 'bg-primary text-white border-primary shadow-md'
                                        : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant/20 hover:bg-surface-container-high'
                                        }`}
                                >
                                    {opt}m
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Section 4: Notes */}
                <FormTextArea
                    name="notes"
                    label="Appointment Notes"
                    placeholder="Allergies, preferences, or special requests..."
                    rows={4}
                />

                {/* Hidden fields needed for Zod validation */}
                <input type="hidden" {...register('branchId')} />
                <input type="hidden" {...register('startsAt')} />
                <input type="hidden" {...register('endsAt')} />

                {/* Error Summary - Only show AFTER submission attempt */}
                {methods.formState.isSubmitted && (Object.keys(errors).length > 0 || mutationError) && (
                    <div className="p-4 rounded-xl bg-error/10 border border-error/20 flex flex-col gap-2">
                        <div className="flex gap-3 items-center">
                            <AlertCircle className="text-error" size={18} />
                            <p className="text-xs text-error font-bold uppercase tracking-wider">Booking Blocked</p>
                        </div>
                        <ul className="pl-7 space-y-1">
                            {mutationError && (
                                <li className="text-[0.7rem] text-error list-disc">{mutationError.message}</li>
                            )}
                            {Object.entries(errors).map(([key, error]: any) => (
                                <li key={key} className="text-[0.7rem] text-error list-disc">
                                    {error.message || `Invalid ${key}`}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Footer Actions */}
                <div className="pt-6 flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="flex-1 py-4 bg-linear-to-br from-primary to-primary-container text-white font-semibold text-sm rounded-xl shadow-lg flex items-center justify-center gap-2"
                        >
                            {isPending && <Loader2 className="animate-spin" size={18} />}
                            {isEdit ? 'Update Appointment' : 'Save Appointment'}
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onClose}
                            className="px-8 py-4 text-on-surface-variant font-medium text-sm rounded-xl"
                        >
                            Cancel
                        </Button>
                    </div>
                    
                    {isEdit && (
                        <button 
                            type="button"
                            disabled={deleteMutation.isPending}
                            onClick={async () => {
                                if (confirm('Are you sure you want to cancel this appointment?')) {
                                    await deleteMutation.mutateAsync(initialData.id);
                                    onClose();
                                }
                            }}
                            className="text-xs font-bold text-error/60 hover:text-error uppercase tracking-widest transition-colors py-2"
                        >
                            {deleteMutation.isPending ? 'Deleting...' : 'Delete Appointment'}
                        </button>
                    )}
                </div>
            </form>
        </FormProvider>
    );
}
