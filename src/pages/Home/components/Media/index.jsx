import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef, useEffect } from 'react';

import './Media.scss';
import SectionTitle from '../SectionTitle';
import { mediaList } from './Media';

gsap.registerPlugin(ScrollTrigger);

function Media() {
    useEffect(() => {
        const textElements = gsap.utils.toArray('.mediaItemLeft');
        textElements.forEach((text) => {
            gsap.fromTo(
                text,
                {
                    x: -500,
                    opacity: 0,
                },
                {
                    x: 0,
                    opacity: 1,
                    scrollTrigger: {
                        trigger: text,
                        end: 'top 50%',
                        scrub: true,
                    },
                },
            );
        });
    }, []);

    useEffect(() => {
        const textElements = gsap.utils.toArray('.mediaItemRight');
        textElements.forEach((text) => {
            gsap.fromTo(
                text,
                {
                    x: 500,
                    opacity: 0,
                },
                {
                    x: 0,
                    opacity: 1,
                    scrollTrigger: {
                        trigger: text,
                        end: 'top 50%',
                        scrub: true,
                    },
                },
            );
        });
    }, []);

    return (
        <div className="wrapper media">
            <SectionTitle title="Truyền Thông" description="Các bên hỗ trợ truyền thông cho bảng xếp hạng!" />
            <div className="mediaContent">
                {mediaList.map((media, index) => (
                    <div key={index} className={`mediaItem ${index % 2 == 0 ? 'mediaItemLeft' : 'mediaItemRight'}`}>
                        <div className="mediaAvatar">
                            <img onClick={() => window.open(media.url, '_blank')} alt="" src={media.avatar} />
                        </div>
                        <div className="mediaInfo">
                            <span>@{media.username}</span>
                            <span className="fullName">{media.name}</span>
                            <p>{media.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Media;
