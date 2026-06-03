const fs = require('fs');
let code = fs.readFileSync('app/page.tsx', 'utf8');

// 1. Add state variables for 2FA and registration
code = code.replace(
  "const [isAdminLoggedIn, setIsAdminLoggedIn] = React.useState<boolean>(false);",
  `const [isAdminLoggedIn, setIsAdminLoggedIn] = React.useState<boolean>(false);
  const [userRole, setUserRole] = React.useState<string>('USER');
  const [isRegistering, setIsRegistering] = React.useState<boolean>(false);
  const [show2FA, setShow2FA] = React.useState<boolean>(false);
  const [mfaToken, setMfaToken] = React.useState<string>('');
  const [requires2FASetup, setRequires2FASetup] = React.useState<boolean>(false);
  const [qrCodeData, setQrCodeData] = React.useState<string>('');
  const [setupSecret, setSetupSecret] = React.useState<string>('');
  const [pendingUserId, setPendingUserId] = React.useState<string>('');`
);

// 2. Replace handleAdminLogin with universal handleAuth
const handleAuthCode = `const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsAuthenticating(true);

    try {
      const endpoint = isRegistering ? '/api/auth/register' : '/api/auth/login';
      const body = { email: adminUsername, password: adminPassword };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      
      if (isRegistering) {
        if (data.success) {
          setIsRegistering(false);
          setAuthError('Account registered. Please log in.');
        } else {
          setAuthError(data.message || 'Registration failed.');
        }
        setIsAuthenticating(false);
        return;
      }

      // Login Flow
      if (data.success) {
        if (data.require2FA) {
          setPendingUserId(data.userId);
          setRequires2FASetup(data.setupRequired);
          setShow2FA(true);
          
          if (data.setupRequired) {
            const qrRes = await fetch('/api/auth/setup-2fa', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId: data.userId, action: 'generate' })
            });
            const qrData = await qrRes.json();
            if (qrData.success) {
              setQrCodeData(qrData.qrCode);
              setSetupSecret(qrData.secret);
            }
          }
        } else if (data.token) {
          setAdminToken(data.token);
          localStorage.setItem('biz_admin_token', data.token);
          setUserRole(data.role);
          if (data.role === 'ADMIN') setIsAdminLoggedIn(true);
          setAdminUsername('');
          setAdminPassword('');
          setAuthError('');
        }
      } else {
        setAuthError(data.message || 'Authentication failed.');
      }
    } catch (err) {
      setAuthError('Connection failure.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handle2FASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsAuthenticating(true);
    try {
      if (requires2FASetup) {
        const res = await fetch('/api/auth/setup-2fa', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: pendingUserId, action: 'verifyAndEnable', token: mfaToken })
        });
        const data = await res.json();
        if (data.success && data.token) {
          setAdminToken(data.token);
          localStorage.setItem('biz_admin_token', data.token);
          setUserRole(data.role);
          if (data.role === 'ADMIN') setIsAdminLoggedIn(true);
          setShow2FA(false);
          setAdminUsername('');
          setAdminPassword('');
        } else {
          setAuthError(data.message || 'Invalid 2FA code.');
        }
      } else {
        const res = await fetch('/api/auth/verify-2fa', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: pendingUserId, token: mfaToken })
        });
        const data = await res.json();
        if (data.success && data.token) {
          setAdminToken(data.token);
          localStorage.setItem('biz_admin_token', data.token);
          setUserRole(data.role);
          if (data.role === 'ADMIN') setIsAdminLoggedIn(true);
          setShow2FA(false);
          setAdminUsername('');
          setAdminPassword('');
        } else {
          setAuthError(data.message || 'Invalid token.');
        }
      }
    } catch (err) {
      setAuthError('2FA Verification failed.');
    } finally {
      setIsAuthenticating(false);
    }
  };
`;
code = code.replace(/const handleAdminLogin = async \(e: React\.FormEvent\) => \{[\s\S]*?\};\n/m, handleAuthCode);

// 3. Update the UI to show register mode and generic title
let formCode = `
<div className="flex items-center space-x-3 mb-6" id="login-hdr-wrap">
  <ShieldCheck className="w-6 h-6 text-emerald-600" id="login-shield-ico" />
  <h1 className="text-xl font-extrabold tracking-tight text-slate-900" id="login-prompt-title">Sign In / Register</h1>
</div>
<p className="text-slate-500 font-medium mb-6">Create an account to submit business listings safely.</p>
`;

code = code.replace(
  /<div className="flex items-center space-x-3 mb-6" id="login-hdr-wrap">[\s\S]*?<\/div>/m,
  formCode
);

let tabsCode = `
<form onSubmit={show2FA ? handle2FASubmit : handleAdminLogin} className="space-y-4" id="login-auth-form">
  {show2FA ? (
    <div className="space-y-4">
      {requires2FASetup && qrCodeData && (
        <div className="flex flex-col items-center">
          <p className="text-xs text-slate-500 mb-2">Scan this QR code with Google Authenticator:</p>
          <img src={qrCodeData} alt="2FA QR Code" className="mb-2" />
          <p className="text-xs font-mono text-slate-400">Secret: {setupSecret}</p>
        </div>
      )}
      <div className="space-y-1">
        <label className="text-xs font-bold text-slate-700">Enter Google Authenticator Code</label>
        <input
          type="text"
          value={mfaToken}
          onChange={(e) => setMfaToken(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm"
          required
        />
      </div>
    </div>
  ) : (
    <>
      <div className="space-y-1" id="login-user-f">
        <label id="lbl-login-user" className="text-xs font-bold text-slate-700">Email Address</label>
`;

code = code.replace(
  /<form onSubmit=\{handleAdminLogin\} className="space-y-4" id="login-auth-form">\s*<div className="space-y-1" id="login-user-f">\s*<label id="lbl-login-user".+?>.*<\/label>/gm,
  tabsCode
);

let buttonsCode = `
  <div className="flex space-x-3 pt-2" id="login-btn-row">
    <button
      id="btn-trigger-login"
      type="submit"
      disabled={isAuthenticating}
      className={\`flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-lg text-sm transition-all \${isAuthenticating ? 'opacity-50 cursor-not-allowed' : ''}\`}
    >
      {isAuthenticating ? 'Processing...' : (show2FA ? 'Verify 2FA' : (isRegistering ? 'Create Account' : 'Authenticate'))}
    </button>
  </div>
</form>
{!show2FA && (
  <div className="mt-4 text-center">
    <button type="button" onClick={() => setIsRegistering(!isRegistering)} className="text-xs text-emerald-600 hover:underline">
      {isRegistering ? 'Already have an account? Sign In' : 'Need an account? Register'}
    </button>
  </div>
)}
`;

code = code.replace(
  /<div className="pt-2" id="login-btn-row">[\s\S]*?<\/form>/m,
  buttonsCode
);

fs.writeFileSync('app/page.tsx', code);
