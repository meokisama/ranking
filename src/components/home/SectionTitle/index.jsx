import './SectionTitle.scss';

function SectionTitle({ title, description }) {
    return (
        <div className="sectionTitle">
            <div className="sectionTitleContent">
                <h1>
                    <span>{title}</span>
                </h1>
                <p>{description}</p>
            </div>
        </div>
    );
}

export default SectionTitle;
