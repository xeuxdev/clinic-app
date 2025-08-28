import { Save } from "lucide-react";
import { useSaveConsultation } from "~/api/appointments";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Textarea } from "~/components/ui/textarea";
import { displayErrorMessage, showSuccessToast } from "~/lib/utils";

import type { GetConsultationNotesResponse } from "~/api/types";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

interface ConsultationNotesTabProps {
  consultationData: GetConsultationNotesResponse;
  appointmentId: number;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
}

const consultationNotesSchema = z.object({
  notes: z.string().min(1, "Notes are required"),
  prescriptions: z.string().optional(),
  recommendations: z.string().optional(),
});

type ConsultationNotesFormData = z.infer<typeof consultationNotesSchema>;

export function ConsultationNotesTab({
  consultationData,
  appointmentId,
  isEditing,
  setIsEditing,
}: ConsultationNotesTabProps) {
  const prevDataRef = useRef<string>("");

  const saveMutation = useSaveConsultation();

  const form = useForm<ConsultationNotesFormData>({
    resolver: zodResolver(consultationNotesSchema),
    defaultValues: {
      notes: "",
      prescriptions: "",
      recommendations: "",
    },
  });

  // Update form values when data changes
  useEffect(() => {
    if (consultationData?.consultation) {
      const consultation = consultationData.consultation;
      const currentDataString = JSON.stringify(consultation);

      // Only update if data actually changed
      if (currentDataString !== prevDataRef.current) {
        prevDataRef.current = currentDataString;

        form.reset({
          notes: consultation.notes || "",
          prescriptions: consultation.prescriptions || "",
          recommendations: consultation.recommendations || "",
        });

        if (isEditing) {
          setIsEditing(false);
        }
      }
    }
  }, [consultationData, form]);

  const onSubmit = async (formData: ConsultationNotesFormData) => {
    try {
      await saveMutation.mutateAsync({
        appointment_id: appointmentId,
        notes: formData.notes,
        prescriptions: formData.prescriptions || "",
        recommendations: formData.recommendations || "",
      });
      setIsEditing(false);
      showSuccessToast("Notes saved successfully!");
    } catch (error) {
      displayErrorMessage(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Consultation Notes</FormLabel>
              <FormControl>
                {isEditing ? (
                  <Textarea
                    {...field}
                    placeholder="Enter detailed consultation notes..."
                    rows={6}
                    className="min-h-[150px]"
                  />
                ) : (
                  <div className="p-4 bg-gray-50 rounded-md min-h-[150px] whitespace-pre-wrap border">
                    {field.value || "No consultation notes available"}
                  </div>
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="prescriptions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prescriptions</FormLabel>
              <FormControl>
                {isEditing ? (
                  <Textarea
                    {...field}
                    placeholder="Enter prescriptions and dosage instructions..."
                    rows={4}
                    className="min-h-[120px]"
                  />
                ) : (
                  <div className="p-4 bg-gray-50 rounded-md min-h-[120px] whitespace-pre-wrap border">
                    {field.value || "No prescriptions provided"}
                  </div>
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="recommendations"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Recommendations</FormLabel>
              <FormControl>
                {isEditing ? (
                  <Textarea
                    {...field}
                    placeholder="Enter follow-up recommendations and care instructions..."
                    rows={4}
                    className="min-h-[120px]"
                  />
                ) : (
                  <div className="p-4 bg-gray-50 rounded-md min-h-[120px] whitespace-pre-wrap border">
                    {field.value || "No recommendations provided"}
                  </div>
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4 border-t">
          {isEditing ? (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditing(false)}
                disabled={saveMutation.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Notes
                  </>
                )}
              </Button>
            </>
          ) : (
            <Button type="button" onClick={() => setIsEditing(true)}>
              Edit Notes
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
