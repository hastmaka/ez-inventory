import {useRef, useEffect, useCallback} from 'react';
import SignaturePadLib from 'signature_pad';
import {ActionIcon, Group, Stack, useComputedColorScheme} from '@mantine/core';
import {IconTrash} from '@tabler/icons-react';
import EzText from '@/ezMantine/text/EzText.tsx';

interface SignaturePadProps {
    onSignatureChange: (dataUrl: string | null) => void;
    width?: number;
    height?: number;
    label?: string;
}

export default function SignaturePad({
    onSignatureChange,
    width,
    height = 200,
    label = 'Draw your signature below',
}: SignaturePadProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const padRef = useRef<SignaturePadLib | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const colorScheme = useComputedColorScheme('light');
    const isDark = colorScheme === 'dark';

    const resizeCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ratio = Math.max(window.devicePixelRatio || 1, 1);
        const w = width || container.clientWidth;

        canvas.width = w * ratio;
        canvas.height = height * ratio;
        canvas.style.width = `${w}px`;
        canvas.style.height = `${height}px`;

        const ctx = canvas.getContext('2d');
        if (ctx) ctx.scale(ratio, ratio);

        // Clear pad data after resize since canvas is cleared
        if (padRef.current) {
            padRef.current.clear();
            onSignatureChange(null);
        }
    }, [width, height, onSignatureChange]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const pad = new SignaturePadLib(canvas, {
            backgroundColor: isDark ? '#25262b' : '#ffffff',
            penColor: isDark ? '#C1C2C5' : '#000000',
        });

        pad.addEventListener('endStroke', () => {
            if (!pad.isEmpty()) {
                onSignatureChange(pad.toDataURL('image/png'));
            }
        });

        padRef.current = pad;
        resizeCanvas();

        const observer = new ResizeObserver(() => resizeCanvas());
        const container = containerRef.current;
        if (container) observer.observe(container);

        return () => {
            pad.off();
            observer.disconnect();
            padRef.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isDark]);

    const handleClear = () => {
        if (padRef.current) {
            padRef.current.clear();
            onSignatureChange(null);
        }
    };

    return (
        <Stack gap={4}>
            <Group justify="space-between">
                <EzText c="dimmed" fz="sm">{label}</EzText>
                <ActionIcon
                    color="red"
                    onClick={handleClear}
                    title="Clear signature"
                >
                    <IconTrash size={24} />
                </ActionIcon>
            </Group>
            <div
                ref={containerRef}
                style={{
                    border: '1px solid var(--mantine-color-default-border)',
                    borderRadius: 8,
                    overflow: 'hidden',
                    cursor: 'crosshair',
                }}
            >
                <canvas ref={canvasRef} style={{display: 'block'}} />
            </div>
        </Stack>
    );
}
