import { classNames } from "../../utils/helpers";

export default function Card({
  as: Component = "div",
  hover = false,
  className = "",
  children,
  ...props
}) {
  return (
    <Component
      className={classNames(
        "rounded-2xl border border-slate-800 bg-slate-900/60 p-5",
        hover &&
          "transition-all duration-200 hover:-translate-y-1 hover:border-slate-700 hover:bg-slate-900 hover:shadow-xl hover:shadow-black/30",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
