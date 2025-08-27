import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { z } from "zod";
import { useLogin } from "~/api/auth";
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

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export function meta() {
  return [
    { title: "Login - Healthcare App" },
    { name: "description", content: "Login to your healthcare account" },
  ];
}

export default function LoginPage() {
  const { mutateAsync } = useLogin();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginForm) => {
    console.log("Login data:", data);

    mutateAsync(data);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-left">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Login
        </h1>
        <p className="text-sm text-muted-foreground">
          Welcome back — continue where you left off.
        </p>
        {/* {JSON.stringify(actionData, null, 2)} */}
      </div>

      <Card className="border-0 shadow-none p-0 bg-transparent">
        <CardContent className="p-0">
          <Form {...form}>
            <form
              method="POST"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >
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
                          className="pl-10 border-border bg-white"
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <PasswordInput
                          placeholder="• • • • • • • •"
                          className="pl-10 border-border bg-white"
                          {...field}
                        />
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
                {form.formState.isSubmitting ? "Logging in..." : "Log In"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link
            to="/auth/signup"
            className="text-primary hover:underline font-medium"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
