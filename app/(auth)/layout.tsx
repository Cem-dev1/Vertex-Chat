const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="h-full flex items-center justify-center">
            {/* Büyük harf Children değil, prop olarak gelen küçük harf children */}
            {children}
        </div>
    );
}

export default AuthLayout;