const isLogin = true;

export default function (context) {
  console.table(Object.keys(context));
  if (!isLogin) {
    context.redirect("/login");
  }
}
