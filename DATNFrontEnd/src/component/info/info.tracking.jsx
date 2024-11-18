import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import Iframe from 'react-iframe';
import { useSearchParams } from 'react-router-dom';

const Container = styled(motion.div)`
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  padding: 2rem;
  overflow: hidden;
  position: relative;
`;

const FlyingObject = styled(motion.div)`
  position: absolute;
  width: 40px;
  height: 40px;
  background-size: contain;
  background-repeat: no-repeat;
`;

const IPadFrame = styled(motion.div)`
  width: 1024px;
  height: 650px;
  position: relative;
  border-radius: 40px;
  padding: 20px;
  background: #000000;
  box-shadow: 
    0 0 0 2px #333,
    -5px 5px 30px rgba(0, 0, 0, 0.3),
    5px 5px 30px rgba(0, 0, 0, 0.3),
    inset 0 0 20px rgba(255, 255, 255, 0.05);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 180px;
    height: 24px;
    background: #000;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    box-shadow: 
      inset 0 -3px 8px rgba(255, 255, 255, 0.1),
      0 2px 10px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 1200px) {
    width: 90vw;
    height: calc(90vw * 0.75);
  }
`;

const Screen = styled(motion.div)`
  width: 100%;
  height: 100%;
  background: #fff;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  box-shadow: 
    inset 0 0 20px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.1);
`;



function TrackingPad() {
    const [isLoading, setIsLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const [trackingID, setTrackingID] = useState("");
    useEffect(() => {
        const code = searchParams.get("tracking_code");
        setTrackingID(code || "");
    }, [searchParams]);
    return (
        <Container
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            style={{
                marginTop: 70
            }}
        >
            <IPadFrame
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                    duration: 0.8,
                    ease: 'easeOut',
                    delay: 0.3,
                }}
            >
                <Screen
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                >
                    <Iframe
                        url={"https://tracking.ghn.dev/?order_code=" + trackingID}
                        width="100%"
                        height="100%"
                        id="tracking-iframe"
                        className="iframe-class"
                        display="block"
                        position="relative"
                        styles={{ border: 'none' }}
                        onLoad={() => setIsLoading(false)}
                    />
                    <AnimatePresence>
                        {isLoading && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    background: 'rgba(0, 0, 0, 0.8)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                }}
                            >
                                Loading...
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Screen>
            </IPadFrame>
        </Container>
    );
}

export default TrackingPad;
