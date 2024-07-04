import { useSpring, useChain, useSpringRef, animated } from '@react-spring/web';
import { useState, useEffect } from 'react';

import './Transition.scss';

function Transition() {
    const [shouldUnmount, setShouldUnmount] = useState(false);

    const propsLeftRef = useSpringRef();
    const propsLeft = useSpring({
        ref: propsLeftRef,
        from: { transform: 'translateX(0)' },
        to: { transform: 'translateX(-100%)' },
        config: { tension: 250, friction: 10 },
    });

    const propsRightRef = useSpringRef();
    const propsRight = useSpring({
        ref: propsRightRef,
        from: { transform: 'translateX(0)' },
        to: { transform: 'translateX(100%)' },
        config: { tension: 250, friction: 10 },
    });

    const propsTransRef = useSpringRef();
    const propsTrans = useSpring({
        ref: propsTransRef,
        from: { opacity: 0 },
        to: { opacity: 1 },
        config: { duration: 300 },
    });

    useChain([propsTransRef, propsLeftRef, propsRightRef], [0, 0.5, 0.5]);

    useEffect(() => {
        document.body.style.position = 'fixed';
        const timeoutId = setTimeout(() => {
            document.body.style.position = '';
            setShouldUnmount(true);
        }, 4000);

        return () => clearTimeout(timeoutId);
    }, []);

    return shouldUnmount ? null : (
        <animated.div style={propsTrans} className="transition">
            <div className="splashTextBG">
                <animated.div className="left" style={propsLeft}>
                    <span>Vietnam</span>
                    <span>Light Novel</span>
                    <span>Ranking</span>
                </animated.div>
                <animated.div className="right" style={propsRight}>
                    <span>BXH</span>
                    <span>Light Novel</span>
                    <span>Việt Nam</span>
                </animated.div>
            </div>
        </animated.div>
    );
}

export default Transition;
