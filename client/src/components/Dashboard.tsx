import React, {useCallback, useState} from "react";
import { Container, Row, Col, Input, Label } from 'reactstrap';
import { ArrowDownUp, GeoAltFill } from "react-bootstrap-icons";
import { Button, Divider, VStack } from "@chakra-ui/react";


import {useReady, useConnect, useAccountPkh, useTezos} from "../hooks/useDApp";
import { AccountInfo } from "./AccountInfo";
import { GenericInput } from "./GenericInput";
import { AtSignIcon } from "@chakra-ui/icons";
import { validateContractAddress } from "../utils";
import { StorageInfo } from "./StorageInfo";
import { BalanceInfo } from "./BalanceInfo";
import { Transfer } from "./Transfer";
import {FcReadingEbook} from "react-icons/all";

const DEFAULT_CONTRACT_ADDRESS = "KT1BGdz5tu4ufLUD6S1E89iKzXZbjZCmwByA";
// const DEFAULT_NETWORK = "edo2net"; // backup network, in case that one goes down: { rpc: "https://edonet.smartpy.io/", name: "edo2net" }


export interface ResourceItemProps {
    type: string;
    amount: number;
}

export function ResourceItem({ type, amount }: ResourceItemProps) {
    return (
        <React.Fragment>
            <div className={"resourceItem"}>
                <img src={`./img/${type}.png`} alt={type}/>
                <p>{amount}</p>
            </div>
        </React.Fragment>
    );
}

export function Dashboard() {
  const ready = useReady();
  const connect = useConnect();
  const pkh = useAccountPkh();

  const handleConnect = React.useCallback(async () => {
    try {
      await connect(
        {
          rpc: "https://edonet.smartpy.io",
          name: "edo2net",
        },
        { forcePermission: true }
      );
    } catch (e) {
      alert(e.message);
    }
  }, [connect]);

  const [contractAddress, setContractAddress] = useState<string>(
    DEFAULT_CONTRACT_ADDRESS
  );
  const [tokenId, setTokenId] = useState<string>("0");



  const [choosenPlanet, setChoosenPlanet] = useState(1);

  const [sellAmount, setSellAmount] = useState('');
  const [buyAmount, setBuyAmount] = useState('');
  const [sellResourceType, setSellResourceType] = useState("0");
  const [buyResourceType, setBuyResourceType] = useState("0");

  const currencySwitcher = () => {
        const localSellResourceType = sellResourceType;
        setSellResourceType(buyResourceType);
        setBuyResourceType(localSellResourceType);
  };

  const divStyle = {
        display: 'inline-block',
        margin: '1em'
  };

    const cardStyle = {
        display: 'inline-block',
        margin: '1em'
    };

    const imgStyle = {
        width: '50%',
        margin: 'auto'
    }

    const h1Style = {
        color: '#fff',
        textAlign: 'center',
        fontSize: '30px',
        fontWeight: 'Bold',
        marginTop: '1em'
    }

  return (
    <Container fluid style={{ maxWidth: "92%" }}>
        <Row>
            <Col sm={4}></Col>
            <Col sm={4}>
                <img className={"dashboard-logo"} src={`./img/logo.png`} alt={'logo'}/>
            </Col>
            <Col sm={4}>
                {!ready && !pkh ? (
                        <div className={"connectButton"}>
                            <Button colorScheme="teal" variant="outline" onClick={handleConnect}>
                                Connect to Temple Wallet
                            </Button>
                        </div>
            ) : (<Row>
                    <Col sm={3}></Col>
                    <Col sm={3}>
                        <ResourceItem type="gold" amount={48950} />
                    </Col>
                    <Col sm={3}>
                        <ResourceItem type="iron" amount={100000} />
                    </Col>
                    <Col sm={3}>
                        <ResourceItem type="fuel" amount={910000} />
                    </Col>
                </Row>)}
            </Col>
        </Row>
        <Row>
            <Col className={"planet-navbar-card "} sm={3} onClick={() => setChoosenPlanet(1)}><img style={imgStyle} src={`./img/spacemap-ocao.png`} alt={'ocao'}/><h1 style={h1Style} >{choosenPlanet == 1 ? <GeoAltFill size={24} /> : null} Ocao</h1></Col>
            <Col className={"planet-navbar-card "} sm={3} onClick={() => setChoosenPlanet(2)}><img style={imgStyle} src={`./img/spacemap-zutis.png`} alt={'ocao'}/><h1 style={h1Style} >{choosenPlanet == 2 ? <GeoAltFill size={24} /> : null} Zutis</h1></Col>
            <Col className={"planet-navbar-card "} sm={3} onClick={() => setChoosenPlanet(3)}><img style={imgStyle} src={`./img/spacemap-vicrion.png`} alt={'ocao'}/><h1 style={h1Style} >{choosenPlanet == 3 ? <GeoAltFill size={24} /> : null} Vicrion</h1></Col>
            <Col className={"planet-navbar-card "} sm={3} onClick={() => setChoosenPlanet(4)}><img style={imgStyle} src={`./img/spacemap-gocury.png`} alt={'ocao'}/><h1 style={h1Style} >{choosenPlanet == 4 ? <GeoAltFill size={24} /> : null} Gocury</h1></Col>
        </Row>
        <Row>
            <Col style={cardStyle} sm={7}>
                <div className={"planet-card"}>
                <Row style={{marginLeft: '1em'}}>
                    <Col style={divStyle}  sm={2}>
                        {choosenPlanet == 1 ? <h3 className={"planet-rates-item"}>GLD/OIL: {900000 * 100000}</h3> : null}
                        {choosenPlanet == 2 ? <h3 className={"planet-rates-item"}>GLD/OIL: {51000 * 9000000}</h3> : null}
                        {choosenPlanet == 3 ? <h3 className={"planet-rates-item"}>GLD/OIL: </h3> : null}
                        {choosenPlanet == 4 ? <h3 className={"planet-rates-item"}>GLD/OIL: </h3> : null}
                    </Col>
                    <Col style={divStyle}  sm={2}>
                        {choosenPlanet == 1 ? <h3 className={"planet-rates-item"}>GLD/IRN: {900000 * 250000}</h3> : null}
                        {choosenPlanet == 2 ? <h3 className={"planet-rates-item"}>GLD/IRN: {51000 * 150000}</h3> : null}
                        {choosenPlanet == 3 ? <h3 className={"planet-rates-item"}>GLD/IRN: </h3> : null}
                        {choosenPlanet == 4 ? <h3 className={"planet-rates-item"}>GLD/IRN: </h3> : null}
                    </Col>
                    <Col style={divStyle}  sm={2}>
                        {choosenPlanet == 1 ? <h3 className={"planet-rates-item"}>OIL/IRN: {100000 * 250000}</h3> : null}
                        {choosenPlanet == 2 ? <h3 className={"planet-rates-item"}>OIL/IRN: {9000000 * 150000}</h3> : null}
                        {choosenPlanet == 3 ? <h3 className={"planet-rates-item"}>OIL/IRN: </h3> : null}
                        {choosenPlanet == 4 ? <h3 className={"planet-rates-item"}>OIL/IRN: </h3> : null}
                    </Col>
                    <Col style={divStyle}  sm={4}>
                        <div className={"moveButton"}>
                            <Button onClick={currencySwitcher}>Move here</Button>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col sm={12}>
                        {choosenPlanet == 1 ? <img className={"planet-card-img"} src={`./img/okao.jpeg`} alt={'ocao'}/> : null}
                        {choosenPlanet == 2 ? <img className={"planet-card-img"} src={`./img/zutis.jpeg`} alt={'zutis'}/> : null}
                        {choosenPlanet == 3 ? <img className={"planet-card-img"} src={`./img/vicrion.jpg`} alt={'vicrion'}/> : null}
                        {choosenPlanet == 4 ? <img className={"planet-card-img"} src={`./img/gocury.jpg`} alt={'zutis'}/> : null}
                    </Col>
                </Row>
                <Row>
                    <Col sm={12}>
                        {choosenPlanet == 1 ?  <p className={"planet-desc-text"}>Tropical planet used to monitor the nearby Zutis fuel production. It is famous for its beautiful views, therefore it is a resort for production owners.</p> : null}
                        {choosenPlanet == 2 ?  <p className={"planet-desc-text"}>A mining planet that has been fought over by crime lords for its valuable Spice. A fissure vent beneath the spice mines served as a source of astatic element that could be refined into hyperfuel for starships.</p> : null}
                        {choosenPlanet == 3 ?  <p className={"planet-desc-text"}>A cosmopolitan urban world made up of one city from the entire planet. A large economic center, so all the richest traders from all over the galaxy come here to become even richer.</p> : null}
                        {choosenPlanet == 4 ?  <p className={"planet-desc-text"}>A poor desert planet, a den of mercenaries, smugglers and speculators. The locals love gold, but they often try to trick inexperienced traders.</p> : null}
                    </Col>
                </Row></div>
            </Col>
            <Col style={cardStyle} sm={4}>
                            <div className={"exchange-card"}>
                                <Label className={"exchange-card-label"}><b>You buy</b></Label>
                                <Row>
                                    <Col sm={7}>
                                        <div className={"exchange-card-input"}>
                                            <Input
                                                type="text"
                                                placeholder="0"
                                                value={sellAmount}
                                                onChange={(event) => {setBuyAmount(choosenPlanet == 1 ? event.target.value * 9 : event.target.value * 0.005); setSellAmount(event.target.value)}}
                                            />
                                        </div>
                                    </Col>
                                    <Col sm={4}>
                                        <div className={"exchange-card-select"}>
                                            <Input
                                                type="select"
                                                value={sellResourceType}
                                                onChange={(event) => setSellResourceType(event.target.value)}
                                            >
                                                <option value="0">Gold</option>
                                                <option value="1">Fuel</option>
                                                <option value="2">Metal</option>
                                            </Input>
                                        </div>
                                    </Col>
                                </Row><br/><br/>
                                <Row>
                                    <Col sm={12}>
                                        <div className={"switchButton"}>
                                            <Button onClick={currencySwitcher}>
                                                <ArrowDownUp size={24} />
                                            </Button>
                                        </div>
                                    </Col>
                                </Row>
                                <Label className={"exchange-card-label"}><b>You sell</b></Label>
                                <Row>
                                    <Col sm={7}>
                                        <div className={"exchange-card-input"}>
                                            <Input
                                                type="text"
                                                placeholder="0"
                                                value={buyAmount}
                                                onChange={(event) => setBuyAmount(event.target.value)}
                                            />
                                        </div>
                                    </Col>
                                    <Col sm={4}>
                                        <div className={"exchange-card-select"}>
                                            <Input
                                                type="select"
                                                value={buyResourceType}
                                                onChange={(event) => setBuyResourceType(event.target.value)}
                                            >
                                                <option value="0">Gold</option>
                                                <option value="1">Fuel</option>
                                                <option value="2">Metal</option>
                                            </Input>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm={10} style={{ textAlign: "center" }}>
                                        {!ready && !pkh ? (
                                            <Button colorScheme="teal" variant="outline" onClick={handleConnect}>
                                                Connect to Temple Wallet
                                            </Button>
                                        ) : (<Transfer
                                            contractAddress={contractAddress}
                                            tokenId={tokenId}
                                            pkh={pkh!}
                                        />)}
                                    </Col>
                                </Row>
                            </div>
            </Col>
        </Row>
        <Row>
            <Col sm={2}>
            {!ready && !pkh ? (
                <div className={"reconnectButton"}>
                    <Button colorScheme="teal" variant="outline" onClick={handleConnect}>
                        Connect to Temple Wallet
                    </Button>
                </div>
            ) : (
                <div className={"reconnectButton"}>
                    <AccountInfo account={pkh!} handleReconnect={handleConnect} />
                </div>
            )}
            </Col>
        </Row>
    </Container>
  );
}
