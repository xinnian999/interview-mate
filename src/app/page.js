'use client';
import {
    XRequest,
    Conversations,
    Sender,
    Welcome,
    useXAgent,
} from '@ant-design/x';
import { Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';

const items = Array.from({ length: 4 }).map((_, index) => ({
    key: `item${index + 1}`,
    label: `Conversation Item ${index + 1}`,
    disabled: index === 3,
}));

const BASE_URL = 'https://api.deepseek.com';
const PATH = '';
const MODEL = 'deepseek-chat';
const API_KEY = 'Bearer sk-e5d58b69a0fa43d089a6f0152c06b326';

const exampleRequest = XRequest({
    baseURL: BASE_URL + PATH,
    model: MODEL,
    dangerouslyApiKey: API_KEY,
});

export default function Home() {
    const [loading, setLoading] = useState(false);
    const [value, setValue] = useState('');

    async function request() {
        await exampleRequest.create(
            {
                messages: [{ role: 'user', content: value }],
                stream: true,
                agentId: 111,
            },
            {
                onSuccess: (messages) => {
                    console.log('onSuccess', messages);
                },
                onError: (error) => {
                    console.error('onError', error);
                },
                onUpdate: (msg) => {
                    console.log('onUpdate', msg);
                },
            }
        );
    }
    return (
        <div className='w-full h-dvh overflow-hidden flex'>
            <div className='w-1/5 border-r border-gray-200 px-4 flex flex-col gap-3'>
                <div className='p-4'>
                    <span className='text-2xl'>面小助</span>
                </div>

                <Button type='primary' block icon={<PlusOutlined />}>
                    新的面试
                </Button>

                <Conversations items={items} defaultActiveKey='item1' />
            </div>

            <div className='w-4/5 h-dvh overflow-hidden bg-gray-50 p-4 flex flex-col'>
                <div className='flex-1'>
                    <Welcome
                        icon='https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp'
                        title="Hello, I'm Ant Design X"
                        description='Base on Ant Design, AGI product interface solution, create a better intelligent vision~'
                    />
                </div>
                <Sender
                    loading={loading}
                    value={value}
                    onChange={(v) => {
                        setValue(v);
                    }}
                    onSubmit={() => {
                        setValue('');
                        setLoading(true);
                        request();
                    }}
                    onCancel={() => {
                        setLoading(false);
                        message.error('Cancel sending!');
                    }}
                    autoSize={{ minRows: 2, maxRows: 6 }}
                />
            </div>
        </div>
    );
}
