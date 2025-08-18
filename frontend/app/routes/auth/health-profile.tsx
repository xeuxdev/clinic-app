import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";

const healthProfileSchema = z.object({
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  bloodGroup: z.string().min(1, "Blood group is required"),
  knownAllergies: z.string(),
  medicalConditions: z.string(),
  currentMedication: z.string(),
});

type HealthProfileForm = z.infer<typeof healthProfileSchema>;

export function meta() {
  return [
    { title: "Health Profile - Healthcare App" },
    { name: "description", content: "Complete your health profile" },
  ];
}

export default function HealthProfile() {
  const form = useForm<HealthProfileForm>({
    resolver: zodResolver(healthProfileSchema),
    defaultValues: {
      dateOfBirth: "",
      bloodGroup: "",
      knownAllergies: "",
      medicalConditions: "",
      currentMedication: "",
    },
  });

  const onSubmit = async (data: HealthProfileForm) => {
    // TODO: Implement health profile submission logic
    console.log("Health profile data:", data);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-left">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Health Profile
        </h1>
        <p className="text-sm text-muted-foreground">
          Providing this information ensures accurate and effective care
        </p>
      </div>

      <Card className="border-0 shadow-none p-0 bg-transparent">
        <CardContent className="p-0">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex items-center gap-5 w-full">
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel required>Date of Birth</FormLabel>
                      <FormControl>
                        <Input type="date" className="bg-white" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bloodGroup"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel required>Blood Group</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter your Blood Group"
                          className="bg-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="knownAllergies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Known Allergies</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter your allergies"
                        className="min-h-[100px] bg-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="medicalConditions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Medical Conditions</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter your medical conditions"
                        className="min-h-[100px] bg-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currentMedication"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Medication</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter your current medication"
                        className="min-h-[100px] bg-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Saving Profile..." : "Sign Up"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            to="/auth/login"
            className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
