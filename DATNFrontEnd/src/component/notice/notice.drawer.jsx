import React, { useState, useEffect } from 'react';
import { Button, Drawer, notification, Empty } from 'antd'; // Nhập Empty từ antd
import NoticeCart from './notice.cart';
import Pusher from 'pusher-js';
import { BellOutlined } from '@ant-design/icons';
import { fetchDataNotice } from '../../service/api.service';
import Pusher from 'pusher-js';

const NoticeDrawer = ({ openNotice, setOpenNotice }) => {
    const [notices, setNotices] = useState([]);

    const onClose = () => {
        setOpenNotice(false);
    };

    const handleNewNotice = (data) => {
        fetchNoticeData();
        notification.open({
            message: data.message,
            description: data.content,
            placement: 'topRight',
            duration: 5,
            icon: <BellOutlined style={{ color: 'yellowgreen' }} />,
            style: {
                border: '1px solid gray',
                borderRadius: '8px',
            },
        });
    };

    const fetchNoticeData = async () => {
        const res = await fetchDataNotice();
        setNotices(res.data.data.content);
    }

    useEffect(() => {
        fetchNoticeData();
        const pusher = new Pusher('23b12a546fae0e5577bc', {
            cluster: 'ap1',
        });

        const channel = pusher.subscribe('my-channel');
        channel.bind('my-event', (data) => {
            console.log("new notification")
            handleNewNotice(data);
        });

        // Cleanup khi component unmount
        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };
    }, []);

    return (
        <>
            <Drawer title="Notification" onClose={onClose} open={openNotice}>
                <div
                    style={{
                        textAlign: 'center',
                        gap: 10,
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                    className="notice-group"
                >
                    {notices.length === 0 ? ( // Kiểm tra độ dài của notices
                        <Empty description="No notifications" /> // Hiển thị thông báo Empty
                    ) : (
                        notices.map((notice) => (
                            <NoticeCart key={notice.id} title={notice.title} content={notice.content} date={notice.createdAt} link={notice.link} setOpenNotice={setOpenNotice} />
                        ))
                    )}
                    {notices.length > 0 &&
                        <Button
                            style={{
                                color: 'white',
                                backgroundColor: 'black',
                                marginBottom: 20,
                                height: 50,
                            }}
                        >
                            Read more
                        </Button>
                    }
                </div>
            </Drawer>
        </>
    );
};

export default NoticeDrawer;
