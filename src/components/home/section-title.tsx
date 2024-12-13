import "./styles/section-title.scss";

function SectionTitle({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="section-title">
      <div className="section-title-content">
        <h1>
          <span>{title}</span>
        </h1>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default SectionTitle;
