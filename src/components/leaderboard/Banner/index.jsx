import './Banner.scss';
import bannerimg from 'assets/bannerimg.webp';

function Banner() {
    return (
        <div className="ld-banner">
            <div className="bannerimg">
                <img src={bannerimg} alt="" />
            </div>
            <div className="bannertext">
                <h1>
                    <span id="bannertext01">Bảng Xếp Hạng </span>
                    <br />
                    <span id="bannertext02"> Light Novel</span>
                    <br />
                    <span id="bannertext03"> Việt Nam</span>
                </h1>
                <span id="extra">BẢNG TỔNG SẮP</span>
            </div>
        </div>
    );
}

export default Banner;
