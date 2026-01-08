function Page({ title, subtitle, rightContent, children, className }) {
  return (
    <div className={className ? `page ${className}` : "page"}>
      <div className="page-header">
        <div className="page-title">{title}</div>
        {rightContent && rightContent}
      </div>
      {subtitle && <div className="section-subtitle">{subtitle}</div>}
      {children}
    </div>
  );
}

export default Page;
