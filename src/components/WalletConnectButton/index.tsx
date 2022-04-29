//src\components\WalletConnectButton\index.tsx

import { useWeb3 } from "@/context/web3Context";
import { formatAddress } from "@/utils/helper";
import LoadingButton from "@mui/lab/LoadingButton";
import { useCallback, useState } from "react";
import styles from "./index.module.css";
import udLogo from "./ud.png";
import Image from "next/image";

export const WalletConnectButton: React.FC = () => {
    //get user logged in wallet address/ens, get connect wallet function
    const { connectWallet, address, ens } = useWeb3();

    const [loading, setLoading] = useState<boolean>(false);

    const connect = useCallback(async () => {
        setLoading(true);
        try {
            await connectWallet("");
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    }, [connectWallet]);

    const connectUD = useCallback(async () => {
        setLoading(true);
        try {
            await connectWallet("custom-uauth");
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    }, [connectWallet]);

    //if user didn't successfully logged in, we shows the wallet connect button
    //if user logged in, we show the logged in user's ens or edted address
    // @ts-ignore
    return (
        <>
            {!address ? (
                <>
                    <LoadingButton
                        loading={loading}
                        onClick={connect}
                        className={styles.connectWalletButton}
                        sx={{
                            "& .MuiLoadingButton-loadingIndicator": {
                                color: "#000",
                            },
                        }}
                    >
                        Connect Wallet
                    </LoadingButton>
                    <LoadingButton
                        startIcon={
                            <Image
                                // style={{height: "30px", display: "inline-block", verticalAlign: "middle"}}
                                src={udLogo}
                                width={30}
                                height={30}
                                alt="UnstoppableDomain Logo"
                            />
                        }
                        loading={loading}
                        onClick={connectUD}
                        className={styles.connectWalletButtonUD}
                        sx={{
                            "& .MuiLoadingButton-loadingIndicator": {
                                color: "#000",
                            },
                        }}
                    >
                        Unstoppable
                    </LoadingButton>
                </>
            ) : (
                <div className={styles.walletInfo}>
                    {formatAddress(address)}
                    <br></br>
                    {ens || null}
                </div>
            )}
        </>
    );
};

WalletConnectButton.displayName = "WalletConnectButton";
