"use client";

import React, { useState, useEffect } from 'react';
import { Search, Plus, Clock, Stars, ChevronDown } from 'lucide-react';
import { Button } from '../ui/Button';
import { FormInput } from '../ui/FormInput';
import { FormSelect } from '../ui/FormSelect';
import { FormTextArea } from '../ui/FormTextArea';
import { useForm, FormProvider } from 'react-hook-form';

interface AppointmentFormProps {
    initialData?: any;
    isEdit?: boolean;
    prefill?: {
        startsAt?: string;
        staffId?: string;
    };
    onClose: () => void;
}

/**
 * AppointmentForm component - Step 1: UI Foundation.
 * Matches the Aura Velvet premium aesthetic from the reference screenshot.
 */
export default function AppointmentForm({
    initialData,
    isEdit = false,
    prefill,
    onClose
}: AppointmentFormProps) {
    const methods = useForm({
        defaultValues: initialData || {
            clientId: '',
            serviceId: '',
            staffId: prefill?.staffId || '',
            startTime: prefill?.startsAt || '',
            duration: 60,
            status: 'booked',
            notes: ''
        }
    });

    const { watch, setValue, register, reset } = methods;

    // React to prop changes (crucial for Drawer-based reuse)
    useEffect(() => {
        reset(initialData || {
            clientId: '',
            serviceId: '',
            staffId: prefill?.staffId || '',
            startTime: prefill?.startsAt || '',
            duration: 60,
            status: 'booked',
            notes: ''
        });
    }, [initialData, prefill, reset]);
    const startTime = watch('startTime');
    const duration = watch('duration');
    const serviceId = watch('serviceId');

    // Hardcoded durations for the demo/UI
    const serviceDurations: Record<string, number> = {
        '1': 90, // Balayage
        '2': 120, // Keratin
        '3': 45,  // Cut
    };

    // 1. Auto-fill duration when service changes
    useEffect(() => {
        if (serviceId && serviceDurations[serviceId]) {
            setValue('duration', serviceDurations[serviceId]);
        }
    }, [serviceId]);

    // 2. Calculate End Time
    const [endsAt, setEndsAt] = useState('--:--');

    useEffect(() => {
        if (!startTime) {
            setEndsAt('--:--');
            return;
        }

        const [hours, minutes] = startTime.split(':').map(Number);
        const date = new Date();
        date.setHours(hours);
        date.setMinutes(minutes + duration);

        const endH = date.getHours().toString().padStart(2, '0');
        const endM = date.getMinutes().toString().padStart(2, '0');
        setEndsAt(`${endH}:${endM}`);
    }, [startTime, duration]);

    const DURATION_OPTIONS = [30, 60, 90, 120];

    return (
        <FormProvider {...methods}>
            <form className="space-y-10">
                {/* Section 1: Client Selection */}
                <section>
                    <div className="flex justify-between items-end mb-4">
                        <label className="text-[0.65rem] uppercase tracking-widest text-on-surface-variant font-bold">Client</label>
                        <button type="button" className="text-[0.7rem] font-semibold text-secondary hover:underline">+ Add New</button>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-on-surface-variant/40" size={18} />
                        <input
                            {...register('clientId')}
                            className="w-full bg-transparent border-none border-b border-outline-variant/30 focus:border-secondary focus:ring-0 pl-8 pb-3 text-on-surface placeholder:text-on-surface-variant/40 text-sm transition-all"
                            placeholder="Search clients by name or phone..."
                            type="text"
                        />
                    </div>
                </section>

                {/* Section 2: Service & Staff */}
                <section className="grid grid-cols-2 gap-6">
                    <FormSelect
                        name="serviceId"
                        label="Service"
                        placeholderText="Select Service"
                        options={[
                            { label: 'Signature Balayage', value: '1' },
                            { label: 'Velvet Keratin Treatment', value: '2' },
                            { label: 'Precision Cut & Style', value: '3' },
                        ]}
                    />

                    <div className="space-y-4">
                        <label className="text-[0.65rem] uppercase tracking-widest text-on-surface-variant font-bold">Staff member</label>
                        <div className="relative group">
                            <div className="flex items-center gap-2 pb-[10px] border-b border-outline-variant/30 cursor-pointer">
                                <div className="w-6 h-6 rounded-full bg-secondary-fixed flex items-center justify-center text-[10px] font-bold text-on-secondary-fixed">SJ</div>
                                <span className="text-sm text-on-surface font-medium">Sarah Jenkins</span>
                            </div>
                            <ChevronDown className="absolute right-0 bottom-3 text-on-surface-variant/30" size={16} />
                        </div>
                    </div>
                </section>

                {/* Section 3: Time Selection */}
                <section className="bg-surface-container-low/50 rounded-xl p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[0.65rem] uppercase tracking-widest text-on-surface-variant font-bold">Start Time</label>
                            <div className="flex items-center gap-2 pb-2 border-b border-outline-variant/30">
                                <Clock className="text-on-surface-variant/60" size={18} />
                                <input
                                    className="bg-transparent border-none focus:ring-0 p-0 text-sm font-medium w-full accent-secondary"
                                    type="time"
                                    {...register('startTime')}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[0.65rem] uppercase tracking-widest text-on-surface-variant font-bold">Ends At</label>
                            <div className="flex items-center gap-1.5 pb-2 border-b border-transparent">
                                <span className="text-sm font-semibold text-primary">{endsAt}</span>
                                <span className="text-[0.65rem] text-on-surface-variant/50 font-medium">(Auto)</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[0.65rem] uppercase tracking-widest text-on-surface-variant font-bold">Duration</label>
                        <div className="flex gap-2">
                            {DURATION_OPTIONS.map((opt) => (
                                <button
                                    key={opt}
                                    type="button"
                                    onClick={() => setValue('duration', opt)}
                                    className={`flex-1 py-2 text-xs font-semibold rounded-full transition-all border ${duration === opt
                                        ? 'bg-primary text-white border-primary shadow-md'
                                        : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant/20 hover:bg-surface-container-high'
                                        }`}
                                >
                                    {opt}m
                                </button>
                            ))}
                            <div className="flex-1 relative">
                                <input
                                    type="number"
                                    {...register('duration', { valueAsNumber: true })}
                                    className="w-full py-2 text-xs font-semibold rounded-full bg-surface-container-lowest border border-outline-variant/20 text-center focus:ring-1 focus:ring-secondary/30 outline-none"
                                    placeholder="Custom"
                                />
                            </div>
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

                {/* Contextual Tip (Salon Style) */}
                <div className="flex gap-4 p-4 rounded-xl bg-tertiary-fixed/30 border border-tertiary-fixed-dim/20">
                    <Stars className="text-tertiary shrink-0" size={20} />
                    <div className="space-y-1">
                        <p className="text-[0.7rem] font-bold text-tertiary uppercase tracking-wider">VIP Availability</p>
                        <p className="text-xs text-on-tertiary-fixed-variant leading-relaxed">
                            This client qualifies for a complimentary Champagne upgrade based on their loyalty status.
                        </p>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-6 flex items-center gap-4">
                    <Button
                        type="submit"
                        className="flex-1 py-4 bg-linear-to-br from-primary to-primary-container text-white font-semibold text-sm rounded-xl shadow-lg"
                    >
                        Save Appointment
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
            </form>
        </FormProvider>
    );
}
