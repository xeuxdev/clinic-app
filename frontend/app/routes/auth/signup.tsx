import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { z } from "zod";
import { useSignUp } from "~/api/auth";
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
import { Icons } from "~/components/ui/icons";
import { Input, PasswordInput } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

const signupSchema = z
  .object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    phoneNumber: z.string().min(10, "Please enter a valid phone number"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    role: z.enum(["doctor", "attendant"], {
      message: "Role is required",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignupForm = z.infer<typeof signupSchema>;

export function meta() {
  return [
    { title: "Create Account - Healthcare App" },
    { name: "description", content: "Create your healthcare account" },
  ];
}

export default function Signup() {
  const { mutateAsync } = useSignUp();

  const form = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignupForm) => {
    mutateAsync({
      full_name: data.fullName,
      email: data.email,
      phone_number: data.phoneNumber,
      password: data.password,
      role: data.role,
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-left">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Create Account
        </h1>
        <p className="text-sm text-muted-foreground">
          Create your profile and take the first step towards easier, more
          connected healthcare.
        </p>
      </div>

      <Card className="border-0 shadow-none p-0 bg-transparent">
        <CardContent className="p-0">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 [&>input]:bg-white"
            >
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Full Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="text"
                          placeholder="Enter your Full Name"
                          className="pl-10 bg-white border-border"
                          {...field}
                        />
                        <Icons.User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Email Address</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="email"
                          placeholder="Enter your Email"
                          className="pl-10 bg-white border-border"
                          {...field}
                        />
                        <Icons.Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="80 1234567"
                        className="h-12 bg-white border-border"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <PasswordInput
                          placeholder="• • • • • • • •"
                          className="pl-10 bg-white border-border"
                          {...field}
                        />
                        <Icons.Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <PasswordInput
                          placeholder="• • • • • • • •"
                          className="pl-10 bg-white border-border"
                          {...field}
                        />
                        <Icons.Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Role</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Select
                          value={field.value}
                          onValueChange={(val) => field.onChange(val)}
                        >
                          <SelectTrigger className="pl-10 bg-white border-border w-full">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>

                          <SelectContent>
                            <SelectItem value="doctor">Doctor</SelectItem>
                            <SelectItem value="attendant">Attendant</SelectItem>
                          </SelectContent>
                        </Select>
                        <Icons.Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
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
                {form.formState.isSubmitting ? "Creating Account..." : "Next"}
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
