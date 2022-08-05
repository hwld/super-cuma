import { json } from "@remix-run/node";
import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { loginFormSchema } from "~/forms/loginForm";
import type { User } from "~/models/user";
import { login } from "~/models/user/finder.server";
import { sessionStorage } from "./session.server";

export const authenticator = new Authenticator<User>(sessionStorage, {
  sessionErrorKey: "error-key",
  throwOnError: true,
});

authenticator.use(
  new FormStrategy(async ({ form }): Promise<User> => {
    const validResult = loginFormSchema.safeParse(
      Object.fromEntries(form.entries())
    );
    if (!validResult.success) {
      throw new Error("データが正しく送信されませんでした。");
    }

    const user = await login(validResult.data);
    if (!user) {
      throw new Error("ユーザーが存在しません。");
    }

    return user;
  }),
  "user-pass"
);

export const requireAuthentication = async (
  request: Request,
  condition?: (user: User) => boolean
): Promise<User> => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  if (condition !== undefined) {
    if (!condition(user)) {
      throw json(null, { status: 403 });
    }
  }

  return user;
};
