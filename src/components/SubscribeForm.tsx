'use client';

import { useState, FormEvent } from 'react';

type FormState = 'idle' | 'loading' | 'success' | 'error';

const SubscribeForm = () => {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<FormState>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setState('loading');
    setMessage('');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setState('success');
        setMessage(data.message || '구독이 완료되었습니다!');
        setEmail('');
      } else {
        setState('error');
        setMessage(data.error || '구독 처리 중 오류가 발생했습니다.');
      }
    } catch (error) {
      setState('error');
      setMessage('네트워크 오류가 발생했습니다.');
      console.error('구독 요청 실패:', error);
    }
  };

  const isDisabled = state === 'loading';

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
      <div className="flex gap-2">
        <input
          type="email"
          placeholder="이메일 주소를 입력하세요"
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={isDisabled}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 disabled:bg-gray-100"
          required
        />
        <button
          type="submit"
          disabled={isDisabled}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow-md disabled:bg-gray-400"
        >
          {state === 'loading' ? '처리 중...' : '구독'}
        </button>
      </div>

      {message && (
        <div
          className={`text-sm p-3 rounded-md ${
            state === 'success'
              ? 'bg-green-50 text-green-800'
              : 'bg-red-50 text-red-800'
          }`}
        >
          {message}
        </div>
      )}
    </form>
  );
};

export default SubscribeForm;
