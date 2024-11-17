import React from 'react';
import { motion } from 'framer-motion';
import { GithubOutlined, CodeOutlined, TeamOutlined, ClockCircleOutlined, UserOutlined, CrownOutlined } from '@ant-design/icons';

const LandingPage = () => {
    const technologies = [
        { name: 'Spring Boot', category: 'Backend' },
        { name: 'ReactJS', category: 'Frontend' },
        { name: 'Docker', category: 'DevOps' },
        { name: 'MySQL', category: 'Database' },
        { name: 'MongoDB', category: 'Database' },
        { name: 'Ant Design', category: 'UI Framework' },
        { name: 'Pusher', category: 'Real-time' },
        { name: 'T5-base Model', category: 'AI/ML' },
        { name: 'Flask RESTful', category: 'API' },
    ];

    const teamMembers = ['Dan Robert', 'Duongdzvippro', 'Dark Fan', 'Drink Ruy', 'Peach All'];

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'white', color: 'black', padding: '0', margin: '0', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ maxWidth: '1200px', padding: '4rem 2rem', textAlign: 'center' }}
            >
                <div style={{ marginBottom: '4rem' }}>
                    <motion.h1
                        initial={{ y: -20 }}
                        animate={{ y: 0 }}
                        style={{ fontSize: '4rem', fontWeight: 'bold', marginBottom: '1rem' }}
                    >
                        SD-99
                    </motion.h1>
                    <p style={{ fontSize: '1.25rem', color: '#555' }}>Sports Wears E-commerce Platform</p>
                </div>

                {/* Project Info Cards */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '4rem' }}>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        style={{
                            backgroundColor: '#f5f5f5',
                            padding: '1.5rem',
                            borderRadius: '12px',
                            textAlign: 'center',
                            width: '200px',
                        }}
                    >
                        <TeamOutlined style={{ fontSize: '2rem', marginBottom: '1rem' }} />
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Team Size</h3>
                        <p style={{ color: '#555' }}>5 Members</p>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        style={{
                            backgroundColor: '#f5f5f5',
                            padding: '1.5rem',
                            borderRadius: '12px',
                            textAlign: 'center',
                            width: '200px',
                        }}
                    >
                        <ClockCircleOutlined style={{ fontSize: '2rem', marginBottom: '1rem' }} />
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Duration</h3>
                        <p style={{ color: '#555' }}>3 Months</p>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        style={{
                            backgroundColor: '#f5f5f5',
                            padding: '1.5rem',
                            borderRadius: '12px',
                            textAlign: 'center',
                            width: '200px',
                        }}
                    >
                        <UserOutlined style={{ fontSize: '2rem', marginBottom: '1rem' }} />
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Supervisor</h3>
                        <p style={{ color: '#555' }}>Mr. Nguyen Quang Ha</p>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        style={{
                            backgroundColor: '#f5f5f5',
                            padding: '1.5rem',
                            borderRadius: '12px',
                            textAlign: 'center',
                            width: '200px',
                        }}
                    >
                        <CodeOutlined style={{ fontSize: '2rem', marginBottom: '1rem' }} />
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Institution</h3>
                        <p style={{ color: '#555' }}>FPT Polytechnic</p>
                    </motion.div>
                </div>

                {/* Technologies Section */}
                <div style={{ marginBottom: '4rem' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '2rem' }}>Technologies Used</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1.5rem', justifyItems: 'center' }}>
                        <motion.div
                            key={"~231"}
                            whileHover={{ scale: 1.1 }}  // Tăng kích thước khi hover
                            style={{
                                backgroundColor: '#fff7d1',  // Nền màu vàng nhạt
                                padding: '1rem',
                                borderRadius: '8px',
                                textAlign: 'center',
                                width: '150px',
                                position: 'relative',  // Để đặt icon ở góc phải
                                boxShadow: '0 0 20px 5px rgba(255, 223, 0, 0.8)',  // Hào quang vàng
                                transition: 'transform 0.3s ease-in-out',  // Chuyển đổi mượt mà
                                animation: 'glow 1.5s infinite alternate'  // Hiệu ứng phát sáng
                            }}
                        >
                            {/* Vương miện từ Ant Design, màu vàng */}
                            <CrownOutlined
                                style={{
                                    position: 'absolute',
                                    top: '-10px',
                                    right: '-10px',
                                    fontSize: '30px',  // Kích thước vương miện
                                    color: '#FFD700',  // Màu vàng cho vương miện
                                }}
                            />
                            <h4 style={{ fontWeight: '600' }}>{"Google Search"}</h4>
                            <p style={{ fontSize: '0.875rem', color: '#555' }}>{"MVP Member"}</p>
                        </motion.div>
                        {technologies.map((tech, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ scale: 1.05 }}
                                style={{
                                    backgroundColor: '#f5f5f5',
                                    padding: '1rem',
                                    borderRadius: '8px',
                                    textAlign: 'center',
                                    width: '150px',
                                }}
                            >
                                <h4 style={{ fontWeight: '600' }}>{tech.name}</h4>
                                <p style={{ fontSize: '0.875rem', color: '#555' }}>{tech.category}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Team Members Section */}
                <div style={{ marginBottom: '4rem' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '2rem' }}>Team Members</h2>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                        {teamMembers.map((member, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ scale: 1.05 }}
                                style={{
                                    backgroundColor: '#f5f5f5',
                                    padding: '1rem',
                                    borderRadius: '8px',
                                    textAlign: 'center',
                                    width: '150px',
                                }}
                            >
                                <h4 style={{ fontWeight: '600' }}>{member}</h4>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Dependencies Section */}
                <div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '2rem', color: '#333' }}>
                        Key Dependencies
                    </h2>
                    <div style={{ backgroundColor: '#f5f5f5', padding: '1.5rem', borderRadius: '12px', justifyContent: 'center', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                        <pre
                            style={{
                                color: '#555',
                                fontSize: '1rem',
                                overflowX: 'auto',
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word',
                                margin: '0 auto',
                                maxWidth: '90%',
                                textAlign: 'left',
                            }}>
                            {`
                • React 18.3.1
                • Ant Design 5.21.6
                • Framer Motion 11.11.11
                • Axios 1.7.7
                • i18next 23.16.5
                • Pusher JS 8.4.0-rc2
                • Styled Components 6.1.13
                • @ant-design/icons 5.4.0
                • antd 5.21.6
                • html2pdf.js 0.10.2
                • i18next-browser-languagedetector 8.0.0
                • i18next-http-backend 2.6.2
                • lodash 4.17.21
                • lodash.debounce 4.0.8
                • moment 2.30.1
                • prop-types 15.8.1
                • react 18.3.1
                • react-dom 18.3.1
                • react-highlight-words 0.20.0
                • react-i18next 15.1.1
                • react-qr-code 2.0.15
                • react-qr-scanner 1.0.0-alpha.11
                • react-router-dom 6.26.2
                • use-debounce 10.0.4
                • spring-boot-starter 3.2.7
                • spring-boot-starter-validation 3.2.7
                • cloudinary-http44 1.39.0
                • pusher-http-java 1.0.0
                • spring-boot-starter-mail 3.2.7
                • spring-boot-starter-web 3.2.7
                • spring-boot-starter-security 3.2.7
                • javax.servlet-api 4.0.1
                • spring-boot-starter-oauth2-resource-server 3.2.5
                • mysql-connector-java 8.0.33
                • lombok 1.18.22
                • spring-boot-starter-test 3.2.7
                • spring-boot-starter-data-jpa 3.2.7
                • hibernate-core 6.2.0.Final
                • hibernate-entitymanager 5.6.15.Final
                • spring-webmvc 6.1.6
                • jakarta.mail 2.0.1
            `}
                        </pre>
                    </div>
                </div>

            </motion.div>

        </div>
    );
};

export default LandingPage;
