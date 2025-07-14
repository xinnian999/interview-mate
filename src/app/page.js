'use client';
import {
    XRequest,
    Conversations,
    Sender,
    Welcome,
    useXAgent,
    useXChat,
    Bubble,
} from '@ant-design/x';
import { Button } from 'antd';
import { PlusOutlined, UserOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

const historyData = Array.from({ length: 4 }).map((_, index) => ({
    key: `item${index + 1}`,
    label: `Conversation Item ${index + 1}`,
    disabled: index === 3,
}));

const rolesAsObject = {
    assistant: {
        placement: 'start',
        avatar: { icon: <img src='/ai.png' alt='' /> },
        typing: { step: 5, interval: 20 },
        style: {
            maxWidth: 700,
        },
        styles: {
            content: {
                backgroundColor: '#fff',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            },
        },
    },
    user: {
        placement: 'end',
        avatar: {
            icon: <UserOutlined />,
            style: { background: '#fde3cf' },
        },
    },
};

let historyMessages = [];

export default function Home() {
    const [loading, setLoading] = useState(false);
    const [value, setValue] = useState('');

    const [agent] = useXAgent({
        request: async (info, callbacks) => {
            const { onUpdate } = callbacks;

            console.log('historyMessages in request', historyMessages);

            setValue('');
            setLoading(true);

            onUpdate('loading');

            const exampleRequest = XRequest({
                baseURL: location.origin + '/api/chat',
            });

            let content = '';

            exampleRequest.create(
                {
                    messages: [
                        ...historyMessages,
                        { role: 'user', content: info.message },
                    ],
                    stream: true,
                },
                {
                    onSuccess: (messages) => {
                        setLoading(false);
                    },
                    onError: (error) => {
                        setLoading(false);
                    },
                    onUpdate: (msg) => {
                        // console.log('onUpdate', msg);
                        try {
                            const data = JSON.parse(msg.data);
                            content += data?.choices[0].delta.content;
                            onUpdate(content);
                        } catch (error) {
                            console.error('onUpdate error', error);
                        }
                    },
                }
            );
        },
    });

    const { onRequest, messages } = useXChat({
        agent,
    });

    useEffect(() => {
        historyMessages = messages.map((item) => ({
            content: item.message,
            role: item.status === 'local' ? 'user' : 'assistant',
        }));
    }, [messages]);

    const items = messages.map(({ message, id, status }) => ({
        key: id,
        content: <ReactMarkdown>{message}</ReactMarkdown>,
        loading: message === 'loading',
        role: status === 'local' ? 'user' : 'assistant',
    }));

    console.log('historyMessages in render', historyMessages);

    return (
        <div className='w-full h-dvh overflow-hidden flex'>
            <div className='w-1/5 border-r border-gray-200 px-4 flex flex-col gap-3'>
                <div className='p-4'>
                    <span className='text-2xl'>面小助</span>
                </div>

                <Button type='primary' block icon={<PlusOutlined />}>
                    新的面试
                </Button>

                <Conversations items={historyData} defaultActiveKey='item1' />
            </div>

            <div className='w-4/5 h-dvh overflow-hidden bg-gray-50 p-4 flex flex-col gap-4'>
                <div className='flex-1 overflow-y-hidden'>
                    {messages.length > 0 ? (
                        <Bubble.List
                            className='h-full overflow-y-auto pb-4'
                            items={items}
                            roles={rolesAsObject}
                        />
                    ) : (
                        <Welcome
                            icon='https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp'
                            title="Hello, I'm Ant Design X"
                            description='Base on Ant Design, AGI product interface solution, create a better intelligent vision~'
                        />
                    )}
                </div>
                <Sender
                    onSubmit={onRequest}
                    loading={loading}
                    value={value}
                    className='bg-white'
                    autoSize={{ minRows: 2, maxRows: 6 }}
                    placeholder='请输入内容...'
                    onChange={(v) => {
                        setValue(v);
                    }}
                />
            </div>
        </div>
    );
}
