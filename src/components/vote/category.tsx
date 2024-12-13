import "./styles/category.scss";

function Category({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="category">
      <h1>{title}</h1>
      {description}
    </div>
  );
}

export default Category;
