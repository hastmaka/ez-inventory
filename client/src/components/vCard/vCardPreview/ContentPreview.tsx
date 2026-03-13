function ContentPreview({
    className,
    prefix,
    firstName,
    additional,
    lastName,
    organization
}: {
    className: string,
    prefix: string,
    firstName: string,
    lastName: string
    additional: string,
    organization: string,
}) {
    return (
        <div className={className}>
            <span>{prefix} {firstName} {additional} {lastName}</span>
            <strong>{organization}</strong>
        </div>
    );
}

export default ContentPreview;