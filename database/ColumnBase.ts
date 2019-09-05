import { Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

export class ColumnBase {

    @Column({ default: true })
    status: boolean;

    @Column({ default: "" })
    remark: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}