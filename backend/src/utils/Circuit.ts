import { readFileSync } from "fs";
import { resolve } from "path";
import { plonk } from "snarkjs";

export class Circuit {
	circuit: string;
	wasmPath: string;
	zkeyPath: string;
	vkey: any;

	constructor(circuit: string) {
		this.circuit = circuit;
		const basePath = __dirname.includes('dist') 
        ? '../../build/circuits' 
        : '../build/circuits';
    
    this.vkey = JSON.parse(
        readFileSync(resolve(__dirname, `${basePath}/${circuit}.vkey.json`), 'utf-8')
    );
    this.zkeyPath = resolve(__dirname, `${basePath}/${circuit}.zkey`);
    this.wasmPath = resolve(__dirname, `${basePath}/${circuit}.wasm`);
	}

	async generateProof(inputs: any): Promise<any> {
		try{
			const { proof, publicSignals } = await plonk.fullProve(inputs, this.wasmPath, this.zkeyPath);
			let proofCalldata = await plonk.exportSolidityCallData(proof, publicSignals);
			proofCalldata = proofCalldata.split(",")[0].toString();
				return { proofJson: proof, proofCalldata: proofCalldata, publicSignals: publicSignals };
		} catch (error) {
			console.log("Error while generating Proof : ", error);
			throw new Error("Equity Thresholds not met");
		}
	}

	async verifyProof(proofJson: any, publicSignals: any): Promise<boolean> {
		const verify = await plonk.verify(this.vkey, publicSignals, proofJson);
		return verify;
	}
}
