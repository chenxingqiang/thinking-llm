export interface ThinkingProcess {
    content: string;
    timestamp: Date;
    category: string;
    isValid?: boolean;
}

export class BaseModel {
    private processes: ThinkingProcess[] = [];

    addThinkingProcess(process: ThinkingProcess): void {
        this.processes.push({
            ...process,
            timestamp: new Date()
        });
    }

    getProcesses(): ThinkingProcess[] {
        return this.processes;
    }

    clearProcesses(): void {
        this.processes = [];
    }
} 