// 'use client';
// import { useState } from 'react';

// export default function HomePage() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [message, setMessage] = useState('');

//   const handleAuth = async (type: 'login' | 'signup') => {
//   const res = await fetch(`/api/${type}`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ email, password }),
//   });

//   const data = await res.json();
//   setMessage(data.message || data.error);
// };

//   return (
//     <main className="p-4">
//       <h1 className="text-2xl font-bold mb-4">Login / Signup</h1>
//       <input
//         className="border p-2 mb-2 w-full"
//         placeholder="Email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//       />
//       <input
//         className="border p-2 mb-4 w-full"
//         type="password"
//         placeholder="Password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//       />
//       <div className="flex gap-2">
//         <button
//           className="bg-blue-600 text-white px-4 py-2 rounded"
//           onClick={() => handleAuth('login')}
//         >
//           Login
//         </button>
//         <button
//           className="bg-green-600 text-white px-4 py-2 rounded"
//           onClick={() => handleAuth('signup')}
//         >
//           Signup
//         </button>
//       </div>
//       {message && <p className="mt-4 text-red-500">{message}</p>}
//     </main>
//   );
// }


'use client';

import { useState } from 'react';

export default function HomePage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    setLoading(true);
    setMessage('');

    const payload: Record<string, string> = {
      email,
      password,
    };

    // Only add firstName and lastName if needed
    if (mode === 'signup') {
      // Optional: If your backend accepts firstName/lastName, uncomment this:
      payload.firstName = firstName;
      payload.lastName = lastName;
    }

    try {
      const res = await fetch(`/api/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      setMessage(data.message || data.error || 'Something went wrong.');
    } catch {
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        {mode === 'login' ? 'Login' : 'Signup'}
      </h1>

      {mode === 'signup' && (
        <>
          <input
            className="border p-2 mb-2 w-full"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            className="border p-2 mb-2 w-full"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </>
      )}

      <input
        className="border p-2 mb-2 w-full"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="border p-2 mb-4 w-full"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        className={`${
          mode === 'login' ? 'bg-blue-600' : 'bg-green-600'
        } text-white px-4 py-2 rounded w-full disabled:opacity-50`}
        onClick={handleAuth}
        disabled={loading}
      >
        {loading ? 'Processing...' : mode === 'login' ? 'Login' : 'Signup'}
      </button>

      <p className="mt-4 text-sm">
        {mode === 'login' ? 'New user?' : 'Already have an account?'}{' '}
        <button
          className="underline text-blue-700"
          onClick={() => {
            setMode(mode === 'login' ? 'signup' : 'login');
            setMessage('');
          }}
        >
          {mode === 'login' ? 'Signup here' : 'Login here'}
        </button>
      </p>

      {message && (
        <p className={`mt-4 text-sm ${message.includes('success') ? 'text-green-600' : 'text-red-500'}`}>
          {message}
        </p>
      )}
    </main>
  );
}
