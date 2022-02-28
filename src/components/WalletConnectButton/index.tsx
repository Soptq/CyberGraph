import { useState, useCallback } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import { useWeb3 } from "@/context/Web3Context";
import { formatAddress } from "@/utils/helper";
import styles from "./index.module.css";

export const WalletConnectButton: React.FC = () => {
    const { connectWallet, address, ens } = useWeb3();
    const [loading, setLoading] = useState<boolean>(false);

    const connect = useCallback(async () => {
        setLoading(true);
        await connectWallet();
        setLoading(false);
    }, [connectWallet]);

    return (
        <>
            {!address ? (
                <LoadingButton
                    loading={loading}
                    onClick={connect}
                    className={styles.connectWalletButton}
                    sx={{
                        "& .MuiLoadingButton-loadingIndicator": {
                            color: "#ffffff",
                        },
                    }}
                >
                    Connect Wallet
                </LoadingButton>
            ) : (
                <div className={styles.userAddress}>
                    Your Address: {ens || formatAddress(address)}
                </div>
            )}
        </>
    );
};

WalletConnectButton.displayName = "WalletConnectButton";