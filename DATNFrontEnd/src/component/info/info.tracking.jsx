import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { AnimatePresence } from 'framer-motion';
import Iframe from 'react-iframe';
import { useSearchParams } from 'react-router-dom';

const Container = styled(motion.div)`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  padding: 2rem;
  overflow: hidden;
  position: relative;
`;

const StringContainer = styled.div`
  position: absolute;
  width: 200px;
  height: 100px;
  top: -98px;
  left: 50%;
  transform: translateX(-50%);
`;

const HangingString = styled.div`
  position: absolute;
  width: 2px;
  height: 120px;
  background: #333;
  transform-origin: bottom center;

  &.left {
    left: 30%;
    transform: rotate(15deg);
  }

  &.right {
    right: 30%;
    transform: rotate(-15deg);
  }
`;

const Nail = styled.div`
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 12px;
  height: 12px;
  background: #666;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 6px;
    height: 6px;
    background: #444;
    border-radius: 50%;
  }
`;

const MacFrame = styled(motion.div)`
  width: 1000px;
  height: 600px;
  position: relative;
  background: #a8a8a8;
  border-radius: 12px;
  padding: 12px;
  box-shadow: 
    0 0 0 2px #b4b4b4,
    0 15px 35px rgba(0, 0, 0, 0.1);

  &::before {
    content: '';
    position: absolute;
    width: 20px;
    height: 4px;
    background: #666;
    top: -2px;
    left: calc(50% - 10px);
    border-radius: 2px;
  }

  @media (max-width: 1200px) {
    width: 90vw;
    height: 55vh;
  }
`;

const Screen = styled(motion.div)`
  width: 100%;
  height: 100%;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
`;

const TopBar = styled.div`
  height: 28px;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  padding: 0 12px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  border-bottom: 1px solid #e0e0e0;
`;

const WindowControls = styled.div`
  display: flex;
  gap: 8px;
`;

const WindowButton = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }
`;

const CloseButton = styled(WindowButton)`
  background: #ff5f57;
  border: 1px solid #e0443e;
`;

const MinimizeButton = styled(WindowButton)`
  background: #ffbd2e;
  border: 1px solid #dea123;
`;

const MaximizeButton = styled(WindowButton)`
  background: #28c940;
  border: 1px solid #1aab29;
`;

const IframeContainer = styled.div`
  flex: 1;
  position: relative;
`;

const LoadingOverlay = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

function TrackingPad() {
    const [isLoading, setIsLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const [trackingID, setTrackingID] = useState("");

    useEffect(() => {
        const code = searchParams.get("tracking_code");
        setTrackingID(code || "");
    }, [searchParams]);

    const swingAnimation = {
        initial: {
            translateY: 0,
            rotate: 0
        },
        animate: {
            translateY: [0, -10, 0],
            transition: {
                duration: 2,
                ease: "easeInOut",
                repeat: 3,
                repeatType: "reverse"
            }
        }
    };

    return (
        <Container
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{
                marginTop: 70
            }}
        >
            <motion.div
                style={{ position: 'relative' }}
                initial="initial"
                animate="animate"
                variants={swingAnimation}
            >
                <StringContainer>
                    <HangingString className="left" />
                    <HangingString className="right" />
                    <Nail />
                </StringContainer>
                <MacFrame>
                    <Screen>
                        <TopBar>
                            <WindowControls>
                                <CloseButton />
                                <MinimizeButton />
                                <MaximizeButton />
                            </WindowControls>
                        </TopBar>
                        <IframeContainer>
                            <Iframe
                                url={`https://tracking.ghn.dev/?order_code=${trackingID}`}
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
                                    <LoadingOverlay
                                        initial={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Spin
                                            indicator={
                                                <LoadingOutlined
                                                    style={{
                                                        fontSize: 24,
                                                        color: '#666'
                                                    }}
                                                    spin
                                                />
                                            }
                                        />
                                    </LoadingOverlay>
                                )}
                            </AnimatePresence>
                        </IframeContainer>
                    </Screen>
                </MacFrame>
            </motion.div>
        </Container>
    );
}

export default TrackingPad;