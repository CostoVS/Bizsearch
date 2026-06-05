#!/bin/bash
# Script to fix the "no verify/continue button in 2FA" issue on the target VPS
echo "Fixing Bizsearch24 2FA Auth Form Button..."

TARGET_FILE="./app/page.tsx"

if [ ! -f "$TARGET_FILE" ]; then
    echo "❌ Error: Could not find $TARGET_FILE. Are you running this from the Bizsearch root directory?"
    exit 1
fi

echo "Updating 2FA button position in $TARGET_FILE..."

# Check if the button is still inner-scoped or already updated
if grep -q "Cancel Verification" "$TARGET_FILE"; then
    echo "✅ Button is already outside ternary or patch is active in code."
else
    # Use highly reliable Node script to modify the file safely using string replacement
    node -e '
const fs = require("fs");
const file = "./app/page.tsx";
let content = fs.readFileSync(file, "utf8");

const oldBlock = `                        <button
                          id="login-submit-action-btn"
                          type="submit"
                          disabled={isAuthenticating}
                          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-99 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/10 disabled:opacity-50 flex items-center justify-center space-x-2"
                        >
                          {isAuthenticating ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin text-white" id="login-spin" />
                              <span>Processing...</span>
                            </>
                          ) : (
                            <span>{show2FA ? '"\x27"Verify 2FA"\x27" : (isRegistering ? "\x27"Create Account"\x27" : "\x27"Sign In"\x27")}</span>
                          )}
                        </button>
                      </>
                    )}`;

const newBlock = `                      </>
                    )}

                    <button
                      id="login-submit-action-btn"
                      type="submit"
                      disabled={isAuthenticating}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-99 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/10 disabled:opacity-50 flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      {isAuthenticating ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-white" id="login-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <span>{show2FA ? "\x27"Verify 2FA"\x27" : (isRegistering ? "\x27"Create Account"\x27" : "\x27"Sign In"\x27")}</span>
                      )}
                    </button>

                    {show2FA && (
                      <button
                        type="button"
                        onClick={() => {
                          setShow2FA(false);
                          setRequires2FASetup(false);
                          setMfaToken("");
                        }}
                        className="w-full py-2 text-xs text-slate-500 hover:text-slate-700 font-semibold hover:underline mt-2 text-center block cursor-pointer"
                      >
                        Cancel Verification
                      </button>
                    )}`

if (content.includes(oldBlock)) {
    content = content.replace(oldBlock, newBlock);
    fs.writeFileSync(file, content, "utf8");
    console.log("✅ File updated successfully.");
} else {
    // Attempt fallback with lighter matches in case whitespace differs
    console.log("⚠️ Standard block match failed. Running advanced pattern replacement...");
    const altRegex = /<button\s+id="login-submit-action-btn"[\s\S]+?<\/button>\s*<\/>\s*\)\s*\}/;
    if (altRegex.test(content)) {
        content = content.replace(altRegex, (match) => {
            return `</>\n                    )}\n\n                    <button\n                      id="login-submit-action-btn"\n                      type="submit"\n                      disabled={isAuthenticating}\n                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-99 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/10 disabled:opacity-50 flex items-center justify-center space-x-2 cursor-pointer"\n                    >\n                      {isAuthenticating ? (\n                        <>\n                          <RefreshCw className="w-4 h-4 animate-spin text-white" id="login-spin" />\n                          <span>Processing...</span>\n                        </>\n                      ) : (\n                        <span>{show2FA ? "Verify 2FA" : (isRegistering ? "Create Account" : "Sign In")}</span>\n                      )}\n                    </button>\n\n                    {show2FA && (\n                      <button\n                        type="button"\n                        onClick={() => {\n                          setShow2FA(false);\n                          setRequires2FASetup(false);\n                          setMfaToken("");\n                        }}\n                        className="w-full py-2 text-xs text-slate-500 hover:text-slate-700 font-semibold hover:underline mt-2 text-center block cursor-pointer"\n                      >\n                        Cancel Verification\n                      </button>\n                    )}`;
        });
        fs.writeFileSync(file, content, "utf8");
        console.log("✅ Advanced regex lookup replacement complete.");
    } else {
        console.log("❌ Could not find target button structures to patch. Ensure code has not been edited manually.");
    }
}
'
fi

echo "Rebuilding docker containers to apply changes..."
docker-compose up -d --build

echo "Done! Refresh your browser and try registering or logging in now."
