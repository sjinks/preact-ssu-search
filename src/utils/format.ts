export function formatDOB(s: string): string {
    if (s === '0000-00-00') {
        return '—';
    }

    const d = new Date(s);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    if (typeof Intl !== 'undefined' && 'DateTimeFormat' in Intl && 'format' in Intl.DateTimeFormat.prototype) {
        return new Intl.DateTimeFormat('default', options).format(d);
    }

    if ('toLocaleDateString' in Date.prototype) {
        try {
            return d.toLocaleDateString('default', options);
        } catch (e) {
            return d.toLocaleDateString();
        }
    }

    return s;
}

export function formatSex(s: string): string {
    switch (s) {
        case 'M':
            return 'Чоловіча';
        case 'F':
            return 'Жіноча';
        default:
            return s;
    }
}

export function formatDDate(s: string): string {
    if (s === '0000-00-00T00:00:00') {
        return '—';
    }

    const d = new Date(s);
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    };

    if (typeof Intl !== 'undefined' && 'DateTimeFormat' in Intl && 'format' in Intl.DateTimeFormat.prototype) {
        return new Intl.DateTimeFormat('default', options).format(d);
    }

    if ('toLocaleString' in Date.prototype) {
        try {
            return d.toLocaleString('default', options);
        } catch (e) {
            return d.toLocaleString();
        }
    }

    return s;
}
