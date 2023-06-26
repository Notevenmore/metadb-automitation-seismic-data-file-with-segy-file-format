export default function HoverText({
  children,
  text,
  additional_styles = '',
  disabled = false,
}) {
  return (
    <div className={'relative group h-full flex items-center'}>
      {children}
      {!disabled && (
        <div
          className={`absolute -top-[25px] bg-black/[.5] hidden group-hover:flex text-[14px] px-3 py-[.5px] rounded-[5px] right-0 text-white w-[max-content] ${additional_styles}`}>
          {text}
        </div>
      )}
    </div>
  );
}
