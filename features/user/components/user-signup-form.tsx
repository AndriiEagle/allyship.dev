"use client"

import { signup } from "@/features/user/actions/user-actions"
import { LoginWithGoogle } from "@/features/user/components/user-login-with-google"
import { LoginFormSchema } from "@/features/user/schemas/user-schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useServerAction } from "zsa-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { Field } from "@/components/forms/field"
import { RouterLink } from "@/components/RouterLink"
import { Logo } from "@/components/site/Logo"

export function UserSignupForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const { execute } = useServerAction(signup, {
    onSuccess: (data) => {
      console.log(data)
    },
    onError: () => {
      console.error("Error")
    },
  })

  const onSubmit = async (data: z.infer<typeof LoginFormSchema>) => {
    execute(data) // Pass the form data to the server action
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="mx-auto">
        <RouterLink href="/">
          <Logo />
        </RouterLink>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            <h1 id="login-form">Sign up</h1>
          </CardTitle>
          <CardDescription>
            {/*  IT should describe why you need an account */}
            Create an allyship.dev account to access the courses, resources and
            monitoring tools.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              aria-labelledby="login-form"
            >
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  {/* <Button
                    type="button"
                    variant="outline"
                    onClick={() => withOAuth("github")}
                    className="w-full"
                  >
                    Sign up with GitHub
                  </Button> */}

                  <LoginWithGoogle />
                </div>

                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                  <span className="relative z-10 bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>

                <div className="flex flex-col gap-4">
                  <Field type="email" name="email" label="E-Mail" required />
                  <Field
                    type="password"
                    name="password"
                    label="Password"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Create new account
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="gap-4 text-sm">
          <RouterLink
            href="/auth/login"
            className="underline underline-offset-4"
          >
            Log in
          </RouterLink>
        </CardFooter>
      </Card>
    </div>
  )
}
