import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/", // 👈 Redirect here instead of /login
  },
  callbacks: {
    authorized({ req, token }) {
      const { pathname } = req.nextUrl;
      const publicPaths = ["/api/auth", "/login", "/register", "/","/api/video"];
      const isPublic = publicPaths.some((path) =>
        pathname === path || pathname.startsWith(path + "/")
      );
      // Public routes
      if (isPublic) {
        return true;
      }
      return !!token; // default fallback
    },
  },
});


export const config = {
  matcher: ["/((?!api|_next|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp|gif|ico|css|js|pdf|ttf|woff|woff2|eot|mp4|webm)).*)"],
};
;

