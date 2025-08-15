import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: 'var(--techwave-site-bg-color)' }}>
            <div className="w-full max-w-md">
                <div className="bg-card border border-border rounded-2xl shadow-2xl p-8 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-6 mb-8">
                        <Link href={route('home')} className="flex flex-col items-center gap-3 group">
                            <div className="flex aspect-square size-16 items-center justify-center rounded-2xl text-white shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                                <svg className="size-8" viewBox="0 0 40 42" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        fill="currentColor"
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M17.2 5.63325L8.6 0.855469L0 5.63325V32.1434L16.2 41.1434L32.4 32.1434V23.699L40 19.4767V9.85547L31.4 5.07769L22.8 9.85547V18.2999L17.2 21.411V5.63325ZM38 18.2999L32.4 21.411V15.2545L38 12.1434V18.2999ZM36.9409 10.4439L31.4 13.5221L25.8591 10.4439L31.4 7.36561L36.9409 10.4439ZM24.8 18.2999V12.1434L30.4 15.2545V21.411L24.8 18.2999ZM23.8 20.0323L29.3409 23.1105L16.2 30.411L10.6591 27.3328L23.8 20.0323ZM7.6 27.9212L15.2 32.1434V38.2999L2 30.9666V7.92116L7.6 11.0323V27.9212ZM8.6 9.29991L3.05913 6.22165L8.6 3.14339L14.1409 6.22165L8.6 9.29991ZM30.4 24.8101L17.2 32.1434V38.2999L30.4 30.9666V24.8101ZM9.6 11.0323L15.2 7.92117V22.5221L9.6 25.6333V11.0323Z"
                                    />
                                </svg>
                            </div>
                            <div className="text-center">
                                <h1 className="text-2xl font-bold" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                                    GatherLake AI
                                </h1>
                                <p className="text-xs text-muted-foreground mt-1">Inteligencia Artificial para SQL</p>
                            </div>
                        </Link>

                        <div className="space-y-2 text-center">
                            <h2 className="text-xl font-semibold text-foreground">{title}</h2>
                            <p className="text-sm text-muted-foreground">{description}</p>
                        </div>
                    </div>
                    
                    {children}
                    
                    <div className="mt-8 pt-6 border-t border-border">
                        <p className="text-xs text-center text-muted-foreground">
                            © 2024 GatherLake AI. Todos los derechos reservados.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
