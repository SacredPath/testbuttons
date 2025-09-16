// Deeplink URLs for different wallets
const walletDeeplinks = {
    phantom: {
        // Using Phantom's universal links format from official documentation
        connect: 'https://phantom.app/ul/browse',
        universal: 'https://phantom.app/ul/',
        custom: 'phantom://',
        fallback: 'https://phantom.app'
    },
    solflare: {
        // Solflare uses official deeplinks with encryption
        connect: 'https://solflare.com/ul/v1/connect',
        signMessage: 'https://solflare.com/ul/v1/signMessage',
        signTransaction: 'https://solflare.com/ul/v1/signTransaction',
        disconnect: 'https://solflare.com/ul/v1/disconnect',
        fallback: 'https://solflare.com'
    },
    backpack: {
        // Backpack uses official deeplinks similar to Solflare
        browse: 'https://backpack.app/ul/v1/browse',
        connect: 'https://backpack.app/ul/v1/connect',
        signMessage: 'https://backpack.app/ul/v1/signMessage',
        signTransaction: 'https://backpack.app/ul/v1/signTransaction',
        disconnect: 'https://backpack.app/ul/v1/disconnect',
        fallback: 'https://backpack.app'
    },
    trustWallet: {
        // Trust Wallet uses WalletConnect for mobile integration
        walletconnect: 'wc:', // WalletConnect protocol
        fallback: 'https://trustwallet.com',
        bridge: 'https://bridge.walletconnect.org'
    }
};

// Function to detect mobile platform
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Function to detect iOS
function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

// Function to detect Android
function isAndroid() {
    return /Android/.test(navigator.userAgent);
}

// Function to open wallet with deeplink
function openWallet(walletName) {
    const wallet = walletDeeplinks[walletName];
    if (!wallet) {
        console.error('Wallet not found:', walletName);
        return;
    }

    if (!isMobile()) {
        // If not mobile, open fallback URL
        window.open(wallet.fallback, '_blank');
        return;
    }

    // Special handling for Phantom using universal links
    if (walletName === 'phantom') {
        openPhantomWallet();
        return;
    }

    // Try to open the app for other wallets
    let deeplinkUrl;
    if (isIOS()) {
        deeplinkUrl = wallet.ios;
    } else if (isAndroid()) {
        deeplinkUrl = wallet.android;
    } else {
        deeplinkUrl = wallet.ios; // Default to iOS format
    }

    // Create a hidden iframe to attempt the deeplink
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = deeplinkUrl;
    document.body.appendChild(iframe);

    // Set a timeout to redirect to fallback if app doesn't open
    setTimeout(() => {
        document.body.removeChild(iframe);
        // If we're still on the same page after 2 seconds, open fallback
        window.open(wallet.fallback, '_blank');
    }, 2000);
}

// Special function for Phantom wallet using universal links
function openPhantomWallet() {
    const phantom = walletDeeplinks.phantom;
    
    // Try universal link first (recommended by Phantom docs)
    const universalLink = phantom.universal;
    
    // Create a hidden iframe to attempt the universal link
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = universalLink;
    document.body.appendChild(iframe);

    // Set a timeout to redirect to fallback if app doesn't open
    setTimeout(() => {
        document.body.removeChild(iframe);
        // If we're still on the same page after 2 seconds, open fallback
        window.open(phantom.fallback, '_blank');
    }, 2000);
}

// Individual wallet functions
function openPhantom() {
    openWallet('phantom');
}

function openSolflare() {
    solflareConnector.connect();
}

function openSolflareSignMessage() {
    solflareConnector.signMessage();
}

function openSolflareSignTransaction() {
    solflareConnector.signTransaction();
}

function openSolflareDisconnect() {
    solflareConnector.disconnect();
}

function openBackpack() {
    backpackConnector.browse();
}

function openBackpackConnect() {
    backpackConnector.connect();
}

function openBackpackSignMessage() {
    backpackConnector.signMessage();
}

function openBackpackSignTransaction() {
    backpackConnector.signTransaction();
}

function openBackpackDisconnect() {
    backpackConnector.disconnect();
}

function openTrustWallet() {
    trustWalletConnector.connect();
}

// Add click animations
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.wallet-btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
});

// Add keyboard support
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' || event.key === ' ') {
        const focusedElement = document.activeElement;
        if (focusedElement.classList.contains('wallet-btn')) {
            focusedElement.click();
        }
    }
});

// Phantom functionality with message signing
class PhantomConnector {
    constructor() {
        this.isConnected = false;
        this.publicKey = null;
        this.session = null;
    }

    // Connect and sign message "hello"
    async connect() {
        if (!isMobile()) {
            window.open('https://phantom.app', '_blank');
            return;
        }

        // Create message signing URL with parameters
        const message = "hello";
        const encodedMessage = encodeURIComponent(message);
        
        // Use Phantom's universal link for message signing
        const phantomUrl = `https://phantom.app/ul/signMessage?message=${encodedMessage}&redirect_link=${encodeURIComponent(window.location.origin)}`;
        
        console.log('Opening Phantom for message signing:', phantomUrl);
        
        // Try to open Phantom app
        window.location.href = phantomUrl;
        
        // Fallback after timeout
        setTimeout(() => {
            window.open('https://phantom.app', '_blank');
        }, 2000);
    }

    // Alternative method using connect flow with message signing
    async connectWithMessageSigning() {
        if (!isMobile()) {
            window.open('https://phantom.app', '_blank');
            return;
        }

        // Create connection URL that will trigger message signing
        const params = new URLSearchParams({
            dapp_encryption_public_key: this.generateDummyKey(),
            cluster: 'mainnet-beta',
            app_url: window.location.origin,
            redirect_link: `${window.location.origin}/phantom-callback`,
            message: 'hello'
        });

        const connectUrl = `https://phantom.app/ul/connect?${params.toString()}`;
        
        console.log('Opening Phantom for connection and message signing:', connectUrl);
        
        // Try to open Phantom app
        window.location.href = connectUrl;
        
        // Fallback after timeout
        setTimeout(() => {
            window.open('https://phantom.app', '_blank');
        }, 2000);
    }

    // Generate dummy key for connection (simplified)
    generateDummyKey() {
        return 'dummy_key_' + Math.random().toString(36).substr(2, 9);
    }

    // Handle incoming deeplink responses
    handleResponse(url) {
        console.log('Received deeplink:', url);
        
        try {
            const urlObj = new URL(url);
            const params = urlObj.searchParams;
            
            // Handle error responses
            if (params.get('errorCode')) {
                console.error('Phantom error:', params.get('errorMessage'));
                alert('Phantom Error: ' + params.get('errorMessage'));
                return;
            }
            
            // Handle successful message signing
            if (params.get('signature')) {
                console.log('Message signed successfully:', params.get('signature'));
                alert('Message "hello" signed successfully!');
                this.isConnected = true;
                this.publicKey = params.get('public_key');
                return;
            }
            
            // Handle connection success
            if (params.get('public_key')) {
                console.log('Connected to Phantom:', params.get('public_key'));
                this.isConnected = true;
                this.publicKey = params.get('public_key');
                alert('Connected to Phantom wallet!');
            }
            
        } catch (error) {
            console.error('Error parsing deeplink response:', error);
        }
    }
}

// Trust Wallet functionality using WalletConnect
class TrustWalletConnector {
    constructor() {
        this.isConnected = false;
        this.accounts = [];
        this.chainId = null;
        this.connector = null;
        this.sessionId = null;
        this.bridge = 'https://bridge.walletconnect.org';
    }

    // Initialize WalletConnect connection
    async connect() {
        if (!isMobile()) {
            window.open('https://trustwallet.com', '_blank');
            return;
        }

        try {
            // Create WalletConnect session
            this.sessionId = this.generateSessionId();
            const key = this.generateKey();
            
            // Create WalletConnect URL
            const walletConnectUrl = `wc:${this.sessionId}@1?bridge=${encodeURIComponent(this.bridge)}&key=${key}`;
            
            console.log('Opening Trust Wallet with WalletConnect:', walletConnectUrl);
            
            // Try to open Trust Wallet app
            window.location.href = `trust://wc?uri=${encodeURIComponent(walletConnectUrl)}`;
            
            // Fallback after timeout
            setTimeout(() => {
                window.open('https://trustwallet.com', '_blank');
            }, 2000);
            
        } catch (error) {
            console.error('Trust Wallet connection error:', error);
            window.open('https://trustwallet.com', '_blank');
        }
    }

    // Sign message "hello" using Trust Wallet
    async signMessage() {
        if (!isMobile()) {
            window.open('https://trustwallet.com', '_blank');
            return;
        }

        try {
            // Create WalletConnect session for message signing
            this.sessionId = this.generateSessionId();
            const key = this.generateKey();
            
            // Create WalletConnect URL with message signing parameters
            const message = "hello";
            const walletConnectUrl = `wc:${this.sessionId}@1?bridge=${encodeURIComponent(this.bridge)}&key=${key}&message=${encodeURIComponent(message)}`;
            
            console.log('Opening Trust Wallet for message signing:', walletConnectUrl);
            
            // Try to open Trust Wallet app for message signing
            window.location.href = `trust://wc?uri=${encodeURIComponent(walletConnectUrl)}&action=signMessage`;
            
            // Fallback after timeout
            setTimeout(() => {
                window.open('https://trustwallet.com', '_blank');
            }, 2000);
            
        } catch (error) {
            console.error('Trust Wallet message signing error:', error);
            window.open('https://trustwallet.com', '_blank');
        }
    }

    // Alternative method using Trust Wallet's custom signing method
    async signMessageCustom() {
        if (!isMobile()) {
            window.open('https://trustwallet.com', '_blank');
            return;
        }

        try {
            // Create session for custom message signing
            this.sessionId = this.generateSessionId();
            const key = this.generateKey();
            
            // Create WalletConnect URL with custom signing parameters
            const message = "hello";
            const network = 60; // Ethereum (SLIP-44)
            
            // Create signing request
            const signRequest = {
                method: "trust_signMessage",
                params: [
                    {
                        network: network,
                        message: message
                    }
                ]
            };
            
            const walletConnectUrl = `wc:${this.sessionId}@1?bridge=${encodeURIComponent(this.bridge)}&key=${key}&request=${encodeURIComponent(JSON.stringify(signRequest))}`;
            
            console.log('Opening Trust Wallet for custom message signing:', walletConnectUrl);
            
            // Try to open Trust Wallet app
            window.location.href = `trust://wc?uri=${encodeURIComponent(walletConnectUrl)}`;
            
            // Fallback after timeout
            setTimeout(() => {
                window.open('https://trustwallet.com', '_blank');
            }, 2000);
            
        } catch (error) {
            console.error('Trust Wallet custom signing error:', error);
            window.open('https://trustwallet.com', '_blank');
        }
    }

    // Generate session ID for WalletConnect
    generateSessionId() {
        return Math.random().toString(36).substr(2, 9);
    }

    // Generate key for WalletConnect
    generateKey() {
        return Math.random().toString(36).substr(2, 9);
    }

    // Handle WalletConnect response
    handleResponse(url) {
        console.log('Received Trust Wallet response:', url);
        
        try {
            const urlObj = new URL(url);
            const params = urlObj.searchParams;
            
            // Handle error responses
            if (params.get('errorCode')) {
                console.error('Trust Wallet error:', params.get('errorMessage'));
                alert('Trust Wallet Error: ' + params.get('errorMessage'));
                return;
            }
            
            // Handle successful message signing
            if (params.get('signature')) {
                console.log('Message signed successfully:', params.get('signature'));
                alert('Message "hello" signed successfully by Trust Wallet!');
                this.isConnected = true;
                return;
            }
            
            // Handle connection success
            if (url.includes('trust://wc')) {
                console.log('Trust Wallet WalletConnect session initiated');
                this.isConnected = true;
                
                // If it's a message signing request, show success
                if (url.includes('signMessage')) {
                    alert('Trust Wallet opened for message signing!');
                }
            }
            
        } catch (error) {
            console.error('Error parsing Trust Wallet response:', error);
        }
    }
}

// Solflare functionality using official deeplinks
class SolflareConnector {
    constructor() {
        this.isConnected = false;
        this.publicKey = null;
        this.session = null;
        this.sharedSecret = null;
        this.dappKeyPair = null;
    }

    // Connect to Solflare wallet
    async connect() {
        if (!isMobile()) {
            window.open('https://solflare.com', '_blank');
            return;
        }

        try {
            // Generate encryption key pair (simplified)
            this.dappKeyPair = this.generateKeyPair();
            
            // Create connection URL with required parameters
            const params = new URLSearchParams({
                app_url: window.location.origin,
                dapp_encryption_public_key: this.dappKeyPair.publicKey,
                redirect_link: `${window.location.origin}/solflare-callback`,
                cluster: 'mainnet-beta' // or 'devnet' for testing
            });

            const connectUrl = `https://solflare.com/ul/v1/connect?${params.toString()}`;
            
            console.log('Opening Solflare for connection:', connectUrl);
            
            // Try to open Solflare app
            window.location.href = connectUrl;
            
            // Fallback after timeout
            setTimeout(() => {
                window.open('https://solflare.com', '_blank');
            }, 2000);
            
        } catch (error) {
            console.error('Solflare connection error:', error);
            window.open('https://solflare.com', '_blank');
        }
    }

    // Sign message "hello" using Solflare (proper implementation)
    async signMessage() {
        if (!isMobile()) {
            window.open('https://solflare.com', '_blank');
            return;
        }

        try {
            // Generate encryption key pair if not exists
            if (!this.dappKeyPair) {
                this.dappKeyPair = this.generateKeyPair();
            }
            
            // Create message signing URL with proper parameters
            const message = "hello";
            const base64Message = btoa(message); // Base64 encode the message
            
            const params = new URLSearchParams({
                message: base64Message,
                session: this.session || 'new_session', // Use existing session or create new
                redirect_link: `${window.location.origin}/solflare-sign-callback`,
                app_url: window.location.origin,
                dapp_encryption_public_key: this.dappKeyPair.publicKey,
                cluster: 'mainnet-beta'
            });

            const signUrl = `https://solflare.com/ul/v1/signMessage?${params.toString()}`;
            
            console.log('Opening Solflare for message signing:', signUrl);
            
            // Try to open Solflare app
            window.location.href = signUrl;
            
            // Fallback after timeout
            setTimeout(() => {
                window.open('https://solflare.com', '_blank');
            }, 2000);
            
        } catch (error) {
            console.error('Solflare message signing error:', error);
            window.open('https://solflare.com', '_blank');
        }
    }

    // Sign transaction using Solflare
    async signTransaction(transaction) {
        if (!isMobile()) {
            window.open('https://solflare.com', '_blank');
            return;
        }

        try {
            // Generate encryption key pair if not exists
            if (!this.dappKeyPair) {
                this.dappKeyPair = this.generateKeyPair();
            }
            
            // Create transaction signing URL
            const params = new URLSearchParams({
                transaction: transaction || 'dummy_transaction', // In real app, this would be serialized transaction
                session: this.session || 'new_session',
                redirect_link: `${window.location.origin}/solflare-tx-callback`,
                app_url: window.location.origin,
                dapp_encryption_public_key: this.dappKeyPair.publicKey,
                cluster: 'mainnet-beta'
            });

            const signUrl = `https://solflare.com/ul/v1/signTransaction?${params.toString()}`;
            
            console.log('Opening Solflare for transaction signing:', signUrl);
            
            // Try to open Solflare app
            window.location.href = signUrl;
            
            // Fallback after timeout
            setTimeout(() => {
                window.open('https://solflare.com', '_blank');
            }, 2000);
            
        } catch (error) {
            console.error('Solflare transaction signing error:', error);
            window.open('https://solflare.com', '_blank');
        }
    }

    // Disconnect from Solflare
    async disconnect() {
        if (!isMobile()) {
            window.open('https://solflare.com', '_blank');
            return;
        }

        try {
            // Generate encryption key pair if not exists
            if (!this.dappKeyPair) {
                this.dappKeyPair = this.generateKeyPair();
            }
            
            // Create disconnect URL
            const params = new URLSearchParams({
                session: this.session || 'new_session',
                redirect_link: `${window.location.origin}/solflare-disconnect-callback`,
                app_url: window.location.origin,
                dapp_encryption_public_key: this.dappKeyPair.publicKey,
                cluster: 'mainnet-beta'
            });

            const disconnectUrl = `https://solflare.com/ul/v1/disconnect?${params.toString()}`;
            
            console.log('Opening Solflare for disconnect:', disconnectUrl);
            
            // Try to open Solflare app
            window.location.href = disconnectUrl;
            
            // Fallback after timeout
            setTimeout(() => {
                window.open('https://solflare.com', '_blank');
            }, 2000);
            
        } catch (error) {
            console.error('Solflare disconnect error:', error);
            window.open('https://solflare.com', '_blank');
        }
    }

    // Generate key pair for encryption (simplified)
    generateKeyPair() {
        // In a real implementation, you'd use proper encryption libraries
        return {
            publicKey: 'dummy_solflare_key_' + Math.random().toString(36).substr(2, 9),
            secretKey: 'dummy_secret_' + Math.random().toString(36).substr(2, 9)
        };
    }

    // Handle incoming deeplink responses
    handleResponse(url) {
        console.log('Received Solflare deeplink:', url);
        
        try {
            const urlObj = new URL(url);
            const params = urlObj.searchParams;
            
            // Handle error responses
            if (params.get('errorCode')) {
                console.error('Solflare error:', params.get('errorMessage'));
                alert('Solflare Error: ' + params.get('errorMessage'));
                return;
            }
            
            // Handle successful connection
            if (urlObj.pathname.includes('/solflare-callback')) {
                const publicKey = params.get('public_key');
                const session = params.get('session');
                
                if (publicKey && session) {
                    console.log('Connected to Solflare:', publicKey);
                    this.isConnected = true;
                    this.publicKey = publicKey;
                    this.session = session;
                    alert('Connected to Solflare wallet!');
                }
            }
            
            // Handle successful message signing
            if (urlObj.pathname.includes('/solflare-sign-callback')) {
                const signature = params.get('signature');
                const publicKey = params.get('public_key');
                
                if (signature) {
                    console.log('Message signed successfully:', signature);
                    alert('Message "hello" signed successfully by Solflare!\nSignature: ' + signature);
                    this.isConnected = true;
                    if (publicKey) this.publicKey = publicKey;
                }
            }
            
            // Handle successful transaction signing
            if (urlObj.pathname.includes('/solflare-tx-callback')) {
                const signature = params.get('signature');
                const publicKey = params.get('public_key');
                
                if (signature) {
                    console.log('Transaction signed successfully:', signature);
                    alert('Transaction signed successfully by Solflare!\nSignature: ' + signature);
                    this.isConnected = true;
                    if (publicKey) this.publicKey = publicKey;
                }
            }
            
            // Handle successful disconnect
            if (urlObj.pathname.includes('/solflare-disconnect-callback')) {
                console.log('Disconnected from Solflare');
                this.isConnected = false;
                this.publicKey = null;
                this.session = null;
                alert('Disconnected from Solflare wallet!');
            }
            
        } catch (error) {
            console.error('Error parsing Solflare response:', error);
        }
    }
}

// Backpack functionality using official deeplinks
class BackpackConnector {
    constructor() {
        this.isConnected = false;
        this.publicKey = null;
        this.session = null;
        this.sharedSecret = null;
        this.dappKeyPair = null;
    }

    // Browse method - opens web app in Backpack's in-app browser
    async browse(targetUrl = window.location.origin) {
        if (!isMobile()) {
            window.open('https://backpack.app', '_blank');
            return;
        }

        try {
            // Create browse URL with proper parameters
            const encodedUrl = encodeURIComponent(targetUrl);
            const encodedRef = encodeURIComponent(window.location.origin);
            
            const browseUrl = `https://backpack.app/ul/v1/browse/${encodedUrl}?ref=${encodedRef}`;
            
            console.log('Opening Backpack browse:', browseUrl);
            
            // Try to open Backpack app
            window.location.href = browseUrl;
            
            // Fallback after timeout
            setTimeout(() => {
                window.open('https://backpack.app', '_blank');
            }, 2000);
            
        } catch (error) {
            console.error('Backpack browse error:', error);
            window.open('https://backpack.app', '_blank');
        }
    }

    // Connect to Backpack wallet
    async connect() {
        if (!isMobile()) {
            window.open('https://backpack.app', '_blank');
            return;
        }

        try {
            // Generate encryption key pair (simplified)
            this.dappKeyPair = this.generateKeyPair();
            
            // Create connection URL with required parameters
            const params = new URLSearchParams({
                app_url: window.location.origin,
                dapp_encryption_public_key: this.dappKeyPair.publicKey,
                redirect_link: `${window.location.origin}/backpack-callback`,
                cluster: 'mainnet-beta' // or 'devnet' for testing
            });

            const connectUrl = `https://backpack.app/ul/v1/connect?${params.toString()}`;
            
            console.log('Opening Backpack for connection:', connectUrl);
            
            // Try to open Backpack app
            window.location.href = connectUrl;
            
            // Fallback after timeout
            setTimeout(() => {
                window.open('https://backpack.app', '_blank');
            }, 2000);
            
        } catch (error) {
            console.error('Backpack connection error:', error);
            window.open('https://backpack.app', '_blank');
        }
    }

    // Sign message "hello" using Backpack
    async signMessage() {
        if (!isMobile()) {
            window.open('https://backpack.app', '_blank');
            return;
        }

        try {
            // Generate encryption key pair if not exists
            if (!this.dappKeyPair) {
                this.dappKeyPair = this.generateKeyPair();
            }
            
            // Create message signing URL with proper parameters
            const message = "hello";
            const base64Message = btoa(message); // Base64 encode the message
            
            const params = new URLSearchParams({
                message: base64Message,
                session: this.session || 'new_session', // Use existing session or create new
                redirect_link: `${window.location.origin}/backpack-sign-callback`,
                app_url: window.location.origin,
                dapp_encryption_public_key: this.dappKeyPair.publicKey,
                cluster: 'mainnet-beta'
            });

            const signUrl = `https://backpack.app/ul/v1/signMessage?${params.toString()}`;
            
            console.log('Opening Backpack for message signing:', signUrl);
            
            // Try to open Backpack app
            window.location.href = signUrl;
            
            // Fallback after timeout
            setTimeout(() => {
                window.open('https://backpack.app', '_blank');
            }, 2000);
            
        } catch (error) {
            console.error('Backpack message signing error:', error);
            window.open('https://backpack.app', '_blank');
        }
    }

    // Sign transaction using Backpack
    async signTransaction(transaction) {
        if (!isMobile()) {
            window.open('https://backpack.app', '_blank');
            return;
        }

        try {
            // Generate encryption key pair if not exists
            if (!this.dappKeyPair) {
                this.dappKeyPair = this.generateKeyPair();
            }
            
            // Create transaction signing URL
            const params = new URLSearchParams({
                transaction: transaction || 'dummy_transaction', // In real app, this would be serialized transaction
                session: this.session || 'new_session',
                redirect_link: `${window.location.origin}/backpack-tx-callback`,
                app_url: window.location.origin,
                dapp_encryption_public_key: this.dappKeyPair.publicKey,
                cluster: 'mainnet-beta'
            });

            const signUrl = `https://backpack.app/ul/v1/signTransaction?${params.toString()}`;
            
            console.log('Opening Backpack for transaction signing:', signUrl);
            
            // Try to open Backpack app
            window.location.href = signUrl;
            
            // Fallback after timeout
            setTimeout(() => {
                window.open('https://backpack.app', '_blank');
            }, 2000);
            
        } catch (error) {
            console.error('Backpack transaction signing error:', error);
            window.open('https://backpack.app', '_blank');
        }
    }

    // Disconnect from Backpack
    async disconnect() {
        if (!isMobile()) {
            window.open('https://backpack.app', '_blank');
            return;
        }

        try {
            // Generate encryption key pair if not exists
            if (!this.dappKeyPair) {
                this.dappKeyPair = this.generateKeyPair();
            }
            
            // Create disconnect URL
            const params = new URLSearchParams({
                session: this.session || 'new_session',
                redirect_link: `${window.location.origin}/backpack-disconnect-callback`,
                app_url: window.location.origin,
                dapp_encryption_public_key: this.dappKeyPair.publicKey,
                cluster: 'mainnet-beta'
            });

            const disconnectUrl = `https://backpack.app/ul/v1/disconnect?${params.toString()}`;
            
            console.log('Opening Backpack for disconnect:', disconnectUrl);
            
            // Try to open Backpack app
            window.location.href = disconnectUrl;
            
            // Fallback after timeout
            setTimeout(() => {
                window.open('https://backpack.app', '_blank');
            }, 2000);
            
        } catch (error) {
            console.error('Backpack disconnect error:', error);
            window.open('https://backpack.app', '_blank');
        }
    }

    // Generate key pair for encryption (simplified)
    generateKeyPair() {
        // In a real implementation, you'd use proper encryption libraries
        return {
            publicKey: 'dummy_backpack_key_' + Math.random().toString(36).substr(2, 9),
            secretKey: 'dummy_secret_' + Math.random().toString(36).substr(2, 9)
        };
    }

    // Handle incoming deeplink responses
    handleResponse(url) {
        console.log('Received Backpack deeplink:', url);
        
        try {
            const urlObj = new URL(url);
            const params = urlObj.searchParams;
            
            // Handle error responses
            if (params.get('errorCode')) {
                console.error('Backpack error:', params.get('errorMessage'));
                alert('Backpack Error: ' + params.get('errorMessage'));
                return;
            }
            
            // Handle successful connection
            if (urlObj.pathname.includes('/backpack-callback')) {
                const publicKey = params.get('public_key');
                const session = params.get('session');
                
                if (publicKey && session) {
                    console.log('Connected to Backpack:', publicKey);
                    this.isConnected = true;
                    this.publicKey = publicKey;
                    this.session = session;
                    alert('Connected to Backpack wallet!');
                }
            }
            
            // Handle successful message signing
            if (urlObj.pathname.includes('/backpack-sign-callback')) {
                const signature = params.get('signature');
                const publicKey = params.get('public_key');
                
                if (signature) {
                    console.log('Message signed successfully:', signature);
                    alert('Message "hello" signed successfully by Backpack!\nSignature: ' + signature);
                    this.isConnected = true;
                    if (publicKey) this.publicKey = publicKey;
                }
            }
            
            // Handle successful transaction signing
            if (urlObj.pathname.includes('/backpack-tx-callback')) {
                const signature = params.get('signature');
                const publicKey = params.get('public_key');
                
                if (signature) {
                    console.log('Transaction signed successfully:', signature);
                    alert('Transaction signed successfully by Backpack!\nSignature: ' + signature);
                    this.isConnected = true;
                    if (publicKey) this.publicKey = publicKey;
                }
            }
            
            // Handle successful disconnect
            if (urlObj.pathname.includes('/backpack-disconnect-callback')) {
                console.log('Disconnected from Backpack');
                this.isConnected = false;
                this.publicKey = null;
                this.session = null;
                alert('Disconnected from Backpack wallet!');
            }
            
        } catch (error) {
            console.error('Error parsing Backpack response:', error);
        }
    }
}

// Initialize connectors
const phantomConnector = new PhantomConnector();
const trustWalletConnector = new TrustWalletConnector();
const solflareConnector = new SolflareConnector();
const backpackConnector = new BackpackConnector();

// Listen for deeplink responses
window.addEventListener('load', () => {
    const url = window.location.href;
    if (url.includes('phantom.app/ul/')) {
        phantomConnector.handleResponse(url);
    }
    if (url.includes('trust://wc')) {
        trustWalletConnector.handleResponse(url);
    }
    if (url.includes('solflare.com/ul/') || url.includes('/solflare-callback') || url.includes('/solflare-sign-callback') || url.includes('/solflare-tx-callback') || url.includes('/solflare-disconnect-callback')) {
        solflareConnector.handleResponse(url);
    }
    if (url.includes('backpack.app/ul/') || url.includes('/backpack-callback') || url.includes('/backpack-sign-callback') || url.includes('/backpack-tx-callback') || url.includes('/backpack-disconnect-callback')) {
        backpackConnector.handleResponse(url);
    }
});

// Enhanced Phantom function - sign message "hello"
function openPhantomAdvanced() {
    phantomConnector.connect();
}

// Alternative Phantom function - connect and sign
function openPhantomConnect() {
    phantomConnector.connectWithMessageSigning();
}

// Trust Wallet functions
function openTrustWalletSignMessage() {
    trustWalletConnector.signMessage();
}

function openTrustWalletSignMessageCustom() {
    trustWalletConnector.signMessageCustom();
}

// Show user agent info for debugging (remove in production)
console.log('User Agent:', navigator.userAgent);
console.log('Is Mobile:', isMobile());
console.log('Is iOS:', isIOS());
console.log('Is Android:', isAndroid());
console.log('Phantom Connector initialized:', phantomConnector);
