import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
@Injectable({
    providedIn: 'root'
})
export class DateUtilService {

    // public orgUrl: string = 'Organize/';

    constructor(private http: HttpClient) { }

    /** ดึงเวลาปัจจุบันจาก backend */
    public timeZone!: string | null;
    public orgId!: number | null;

    async getOrgDateNow(): Promise<string> {
        // if (!this.orgId) {
        //     this.orgId = Number(document.cookie
        //         .split('; ')
        //         .find(row => row.startsWith('currentOrgId='))?.split('=')[1] ?? null);
        // }


        this.timeZone = "Asia/Bangkok"
        // if (!this.timeZone) {
        //     let res = await firstValueFrom(
        //         this.http.get<{ timeZone: string, dateTime: string }>(
        //             `${environment.urlApi}${this.orgUrl}GetDatetimeUTC/${this.orgId}`
        //         )
        //     );
        //     this.timeZone = res.timeZone;
        // }


        const nowUtc = new Date();

        const parts = new Intl.DateTimeFormat('en-US', {
            timeZone: this.timeZone, // asia/bangkok
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        }).formatToParts(nowUtc);
        const y = Number(parts.find(p => p.type === 'year')?.value);
        const m = this.pad(Number(parts.find(p => p.type === 'month')?.value));
        const d = this.pad(Number(parts.find(p => p.type === 'day')?.value));
        const hh = this.pad(Number(parts.find(p => p.type === 'hour')?.value));
        const mm = this.pad(Number(parts.find(p => p.type === 'minute')?.value));
        const ss = this.pad(Number(parts.find(p => p.type === 'second')?.value));


        // return new Date(y, Number(m) - 1, Number(d), Number(hh), Number(mm), Number(ss));
        return `${y}-${m}-${d}T${hh}:${mm}:${ss}`;

    }

    /** clone date */
    public from(input: any): Date {
        if (input instanceof Date) return input;

        if (typeof input === 'string') {
            // string รูปแบบ "2025-12-11 18:20:00"
            return new Date(input.replace(" ", "T"));
        }

        return new Date(input);
    }


    startOfDay(date: string | Date): any {
        const d = this.toOrgString(date);
        return d.split('T')[0] + 'T00:00:00';
    }

    endOfDay(date: Date | string): any {
        const d = this.toOrgString(date);
        return d.split('T')[0] + 'T23:59:59';
    }

    addDays(date: Date | string, days: number): any {
        const d = this.from(date);
        d.setDate(d.getDate() + days);
        return this.toOrgString(d);
    }

    /** add years*/
    addYears(date: Date | string, years: number): any {
        const d = this.from(date);
        d.setFullYear(d.getFullYear() + years);
        return this.toOrgString(d);
    }
    /** add hours*/
    addHours(date: Date | string, hours: number): any {
        const d = this.from(date);
        d.setHours(d.getHours() + hours);
        return this.toOrgString(d);
    }

    /** add months */
    addMonths(date: Date | string, months: number): any {
        const d = this.from(date);
        d.setMonth(d.getMonth() + months);
        return this.toOrgString(d);
    }

    /** add minutes */
    addMinutes(date: Date | string, minutes: number): any {
        const d = this.from(date);
        d.setMinutes(d.getMinutes() + minutes);
        return this.toOrgString(d);
    }

    diffInDays(a: Date | string, b: Date | string): number {
        const dateA = new Date(a);
        const dateB = new Date(b);

        if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
            throw new Error('Invalid date');
        }

        return Math.floor((dateA.getTime() - dateB.getTime()) / 86400000);
    }

    /** isSameDay : true ถ้าวันเดียวกัน*/
    isSameDay(a: Date, b: Date): boolean {
        return (
            a.getFullYear() === b.getFullYear() &&
            a.getMonth() === b.getMonth() &&
            a.getDate() === b.getDate()
        );
    }

    pad(n: number) { //
        return n.toString().padStart(2, '0');
    }
    /**
   * คืนค่า Date object เป็น startOfDay ของวัน X วันที่ผ่านมา (daysAgo)
   */
    public async startOfDayDaysAgo(daysAgo: number) {
        const now = await this.getOrgDateNow()
        const target = this.addDays(now, -daysAgo); // ลบจำนวนวัน
        return this.startOfDay(target);// ตั้งเวลาเป็น 00:00:00
        // : return = 2025-12-12 12:12 => 2025-12-13 12:12 => 2025-12-13 00:00
    }
    public startOfHour(date: Date | string): any {
        const d = this.from(date); // clone date
        d.setMinutes(0, 0, 0);     // นาที = 0, วินาที = 0, มิลลิวินาที = 0
        return this.toOrgString(d);
    }
    public isAfter(a: Date, b: Date): boolean {
        return a.getTime() > b.getTime();
    }
    public isSameOrBefore(a: Date, b: Date): boolean {
        return a.getTime() <= b.getTime();
    }
    public setDateFields(
        date: Date | string,
        fields: {
            hours?: number;
            minutes?: number;
            seconds?: number;
            milliseconds?: number;
        }
    ): string {
        // ✅ CASE 1: string (org time)
        if (typeof date === 'string') {
            const clean = this.removeTimezone(date)
            const base = date.slice(0, 10);

            const h = String(fields.hours ?? clean.slice(11, 13)).padStart(2, '0');
            const m = String(fields.minutes ?? clean.slice(14, 16)).padStart(2, '0');
            const s = String(fields.seconds ?? clean.slice(17, 19)).padStart(2, '0');

            return `${base}T${h}:${m}:${s}`;
        }

        // ✅ CASE 2: Date (ใช้ Date จริง)


        const d = new Date(date)


        if (fields.hours !== undefined) d.setHours(fields.hours);
        if (fields.minutes !== undefined) d.setMinutes(fields.minutes);
        if (fields.seconds !== undefined) d.setSeconds(fields.seconds);
        if (fields.milliseconds !== undefined) d.setMilliseconds(fields.milliseconds);

        return this.toIsoWithoutOffset(d);
    }
    public removeTimezone(date: any): string {
        return date.replace(/([+-]\d{2}:\d{2}|Z)$/, '');
    }
    public toIsoWithoutOffset(date: Date): string {
        const pad = (n: number) => n.toString().padStart(2, '0');

        return (
            `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
            `T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
        );
    }

    formatOrgDate(date: Date | string): any {
        const d = this.from(date);

        const options: Intl.DateTimeFormatOptions = {
            timeZone: this.timeZone!,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        };

        const formatter = new Intl.DateTimeFormat('en-GB', options);
        const parts = formatter.formatToParts(d);

        const map: any = {};
        parts.forEach(p => map[p.type] = p.value);

        return `${map.year}-${map.month}-${map.day} ${map.hour}:${map.minute}:${map.second}`;
    }
    //for date range box
    public formatDateRangeOrgLocal(range: Date[]) {
        if (!range || range.length !== 2) return null;

        const start = this.toOrgLocal(new Date(range[0]), this.timeZone!, true);
        const end = this.toOrgLocal(new Date(range[1]), this.timeZone!, false);

        return {
            startDate: start,
            endDate: end
        };
    }
    private toOrgLocal(date: Date, timeZone: string, isStart: boolean): any {
        const options: Intl.DateTimeFormatOptions = {
            timeZone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        };

        const formatter = new Intl.DateTimeFormat('en-GB', options);
        const parts = formatter.formatToParts(date);

        const map: any = {};
        parts.forEach(p => map[p.type] = p.value);

        const hh = isStart ? '00' : '23';
        const mm = isStart ? '00' : '59';
        const ss = isStart ? '00' : '59';

        // ไม่มี Z, ไม่มี offset
        return `${map.year}-${map.month}-${map.day}T${hh}:${mm}:${ss}`;
    }
    public toLocalString(date: Date | string | null): any {
        if (!date) return '';

        const d = typeof date === 'string' ? new Date(date) : date;

        const y = d.getFullYear();
        const m = ('0' + (d.getMonth() + 1)).slice(-2);
        const day = ('0' + d.getDate()).slice(-2);
        const hh = ('0' + d.getHours()).slice(-2);
        const mm = ('0' + d.getMinutes()).slice(-2);
        const ss = ('0' + d.getSeconds()).slice(-2);

        return `${y}-${m}-${day}T${hh}:${mm}:${ss}`;
    }
    public toOrgString(value: string | Date | null): string {
        if (!value) return '';

        let date: Date;

        // 1️⃣ ถ้าเป็น string
        if (typeof value === 'string') {

            // ตรวจสอบว่ามี offset หรือไม่
            const hasOffset = /([+-]\d{2}:\d{2}|Z)$/.test(value);

            if (!hasOffset) {
                value = `${value}`;
                return value
            }

            date = new Date(value); // parse เป็น Date object
        }
        // 2️⃣ ถ้าเป็น Date
        else if (value instanceof Date) {
            date = value;
        } else {
            return '';
        }

        // ใช้ Intl.DateTimeFormat กับ timezone ของ org
        const parts = new Intl.DateTimeFormat('en-CA', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        }).formatToParts(date);

        const get = (type: string) =>
            parts.find(p => p.type === type)?.value ?? '00';

        return `${get('year')}-${get('month')}-${get('day')}T${get('hour')}:${get('minute')}:${get('second')}`;
    }
    formatIsoString(value: string): string {
        const months = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];

        const [datePart, timePart] = value.split('T');
        const [year, month, day] = datePart.split('-');
        const [hour, minute, second] = timePart.split(':');

        return `${day} ${months[+month - 1]} ${year} ${hour}:${minute}:${second}`;
    }

}
