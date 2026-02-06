export class SnowflakeID {
    private lastTimestamp: bigint = 0n;
    private sequence: bigint = 0n;
    private workerId: bigint;
    private datacenterId: bigint;

    // Snowflake epoch: 2015-01-01 00:00:00 UTC (same as Twitter)
    private readonly EPOCH = 1420070400000n;

    // Bit allocation
    private readonly TIMESTAMP_BITS = 41n;
    private readonly DATACENTER_BITS = 5n;
    private readonly WORKER_BITS = 5n;
    private readonly SEQUENCE_BITS = 12n;

    // Max values
    private readonly MAX_DATACENTER = (1n << this.DATACENTER_BITS) - 1n;
    private readonly MAX_WORKER = (1n << this.WORKER_BITS) - 1n;
    private readonly MAX_SEQUENCE = (1n << this.SEQUENCE_BITS) - 1n;

    constructor(datacenterId: number = 1, workerId: number = 1) {
        if (datacenterId > Number(this.MAX_DATACENTER) || datacenterId < 0) {
            throw new Error(`datacenterId must be between 0 and ${this.MAX_DATACENTER}`);
        }
        if (workerId > Number(this.MAX_WORKER) || workerId < 0) {
            throw new Error(`workerId must be between 0 and ${this.MAX_WORKER}`);
        }
        this.datacenterId = BigInt(datacenterId);
        this.workerId = BigInt(workerId);
    }

    // Generate a new Snowflake ID
    generate(): string {
        let timestamp = BigInt(Date.now());

        if (timestamp === this.lastTimestamp) {
            this.sequence = (this.sequence + 1n) & this.MAX_SEQUENCE;
            if (this.sequence === 0n) {
                while (timestamp <= this.lastTimestamp) {
                    timestamp = BigInt(Date.now());
                }
            }
        } else {
            this.sequence = 0n;
        }

        this.lastTimestamp = timestamp;

        const id =
            // @ts-ignore
            ((timestamp - this.EPOCH) << Number(this.DATACENTER_BITS + this.WORKER_BITS + this.SEQUENCE_BITS)) |
            (Number(this.datacenterId) << Number(this.WORKER_BITS + this.SEQUENCE_BITS)) |
            (Number(this.workerId) << Number(this.SEQUENCE_BITS)) |
            Number(this.sequence);

        return id.toString();
    }

    // Convert UUID to Snowflake ID
    uuidToSnowflake(uuid: string): string {
        // Remove hyphens and validate UUID format
        const cleanUuid = uuid.replace(/-/g, "");
        if (!/^[0-9a-f]{32}$/i.test(cleanUuid)) {
            throw new Error("Invalid UUID format");
        }

        // Take first 12 hex characters (48 bits) and convert to decimal
        const hexPart = cleanUuid.substring(0, 12);
        const decimalValue = BigInt("0x" + hexPart).toString();

        return decimalValue;
    }

    // Parse Snowflake ID to extract components
    parse(id: string): {
        id: string;
        timestamp: number;
        dataCenterId: number;
        workerId: number;
        sequence: number;
        date: string;
    } {
        const idBig = BigInt(id);

        const sequenceMask = (1n << this.SEQUENCE_BITS) - 1n;
        const sequence = Number(idBig & sequenceMask);

        const workerMask = ((1n << this.WORKER_BITS) - 1n) << this.SEQUENCE_BITS;
        const workerId = Number((idBig & workerMask) >> this.SEQUENCE_BITS);

        const datacenterMask = ((1n << this.DATACENTER_BITS) - 1n) << (this.WORKER_BITS + this.SEQUENCE_BITS);
        const datacenterId = Number((idBig & datacenterMask) >> (this.WORKER_BITS + this.SEQUENCE_BITS));

        const timestampMask = ((1n << this.TIMESTAMP_BITS) - 1n) << (this.DATACENTER_BITS + this.WORKER_BITS + this.SEQUENCE_BITS);
        const timestamp = Number((idBig & timestampMask) >> (this.DATACENTER_BITS + this.WORKER_BITS + this.SEQUENCE_BITS));

        const date = new Date(timestamp + Number(this.EPOCH)).toISOString();

        return {
            id,
            timestamp,
            dataCenterId: datacenterId,
            workerId,
            sequence,
            date
        };
    }
}
