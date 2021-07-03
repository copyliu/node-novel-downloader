/// <reference types="node" />
export declare const rsa_key = "MIICXgIBAAKBgQCvJzUdZU5yHyHrOqEViTY95gejrLAxsdLhjKYKW1QqX+vlcJ7iNrLZoWTaEHDONeyM+1qpT821JrvUeHRCpixhBKjoTnVWnofV5NiDz46iLuU25C2UcZGN3STNYbW8+e3f66HrCS5GV6rLHxuRCWrjXPkXAAU3y2+CIhY0jJU7JwIDAQABAoGBAIs/6YtoSjiSpb3Ey+I6RyRo5/PpS98GV/i3gB5Fw6E4x2uO4NJJ2GELXgm7/mMDHgBrqQVoi8uUcsoVxaBjSm25737TGCueoR/oqsY7Qy540gylp4XAe9PPbDSmhDPSJYpersVjKzDAR/b9jy3WLKjAR6j7rSrv0ooHhj3oge1RAkEA4s1ZTb+u4KPfUACL9p/4GuHtMC4s1bmjQVxPPAHTp2mdCzk3p4lRKrz7YFJOt8245dD/6c0M8o4rcHuh6AgCKQJBAMWzrZwptbihKeR7DWlxCU8BO1kH+z6yw+PgaRrTSpII2un+heJXeEGdk0Oqr7Aos0hia4zqTXY1Rie24GDHHM8CQQC7yVjy5g4u06BXxkwdBLDR2VShOupGf/Ercfns7npHuEueel6Zajn5UAY2549j4oMATf9Gn0/kGVDgTo1s6AyZAkApc6PqA0DLxlbPRhGo0v99pid4YlkGa1rxM4M2Eakn911XBHuz2l0nfM98t5QAnngArEoakKHPMBpWh1yCTh03AkEAmcOddu2RrPGQ00q6IKx+9ysPx71+ecBgHoqymHL9vHmrr3ghu4shUdDxQfz/xA2Z8m/on78hBZbnD1CNPmPOxQ==";
export declare const key: import("crypto").KeyObject;
export declare function decryptBufferV4(buffer: Buffer): Buffer;
export declare function decryptBase64V4(base64: string): Buffer;
export declare const txt_key: "IBAAKCAQEAsUAdKtXNt8cdrcTXLsaFKj9bSK1nEOAROGn2KJXlEVekcPssKUxSN8dsfba51kmHM";
export declare function getTokenV4(path: string): {
    ts: number;
    sign_text: string;
    sign: string;
};
