import './Category.scss';

function Category({ title, description }) {
    return (
        <div className="category">
            <h1>{title}</h1>
            {description}
        </div>
    );
}

export default Category;
