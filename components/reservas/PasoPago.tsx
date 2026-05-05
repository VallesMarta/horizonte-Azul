import { FaCreditCard, FaShoppingCart, FaLock } from "react-icons/fa";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";

interface Props {
  metodo: "tarjeta" | "transferencia" | "paypal";
  setMetodo: (m: "tarjeta" | "transferencia" | "paypal") => void;
  tarjetasGuardadas: any[];
  usarTarjetaGuardada: string | null;
  setUsarTarjetaGuardada: (id: string | null) => void;
  guardarTarjeta: boolean;
  setGuardarTarjeta: (v: boolean) => void;
  precioTotal: number;
  loading: boolean;
  onVolver: () => void;
  onPagar: () => void;
}

const STRIPE_BASE = {
  fontSize: "15px",
  fontFamily: "Lato, sans-serif",
  color: "#1f2937",
  "::placeholder": { color: "#7082a0" },
};

export function PasoPago({
  metodo,
  setMetodo,
  tarjetasGuardadas,
  usarTarjetaGuardada,
  setUsarTarjetaGuardada,
  guardarTarjeta,
  setGuardarTarjeta,
  precioTotal,
  loading,
  onVolver,
  onPagar,
}: Props) {
  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      <h2 className="text-lg font-black text-titulo-resaltado uppercase tracking-tighter flex items-center gap-2">
        <FaCreditCard size={14} /> Método de pago
      </h2>

      {/* SELECTOR MÉTODO */}
      <div className="grid grid-cols-3 gap-2">
        {(["tarjeta", "transferencia", "paypal"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMetodo(m)}
            className={`py-3 px-2 rounded-xl font-black text-[10px] uppercase border-2 transition-all ${
              metodo === m
                ? "bg-primario text-blanco-fijo border-primario shadow-md shadow-primario/20"
                : "bg-bg text-gris border-borde hover:border-primario/40 hover:text-primario"
            }`}
          >
            {m === "tarjeta"
              ? "💳 Tarjeta"
              : m === "paypal"
                ? "🅿 PayPal"
                : "🏦 Transfer"}
          </button>
        ))}
      </div>

      {/* TARJETA */}
      {metodo === "tarjeta" && (
        <div className="space-y-4">
          {/* Tarjetas guardadas */}
          {tarjetasGuardadas.length > 0 && (
            <div className="space-y-2">
              <p className="text-[9px] font-black text-gris uppercase tracking-widest">
                Tarjetas guardadas
              </p>
              {tarjetasGuardadas.map((t) => (
                <button
                  key={t.id}
                  onClick={() =>
                    setUsarTarjetaGuardada(t.stripePaymentMethodId)
                  }
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                    usarTarjetaGuardada === t.stripePaymentMethodId
                      ? "border-primario bg-primario/5"
                      : "border-borde bg-bg hover:border-primario/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-primario/10 p-2 rounded-lg">
                      <FaCreditCard size={12} className="text-primario" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-black text-texto uppercase">
                        {t.brand} •••• {t.last4}
                      </p>
                      {/* MOSTRAMOS LA EXPIRACIÓN */}
                      <p className="text-[9px] text-gris font-bold uppercase">
                        Expira: {t.expMonth}/{t.expYear}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border-2 transition-all ${
                      usarTarjetaGuardada === t.stripePaymentMethodId
                        ? "bg-primario border-primario"
                        : "border-borde"
                    }`}
                  />
                </button>
              ))}
              {usarTarjetaGuardada && (
                <button
                  onClick={() => setUsarTarjetaGuardada(null)}
                  className="w-full py-2 text-[10px] font-black uppercase text-primario hover:text-secundario transition-colors"
                >
                  + Usar otra tarjeta
                </button>
              )}
            </div>
          )}

          {/* Nueva tarjeta */}
          {!usarTarjetaGuardada && (
            <div className="bg-bg border border-borde rounded-3xl p-5 space-y-4">
              {/* Número */}
              <div>
                <label className="text-[9px] font-black text-gris uppercase tracking-widest block mb-1.5">
                  Número de tarjeta
                </label>
                <div className="bg-fondo border border-borde rounded-xl p-3 focus-within:border-primario transition-colors">
                  <CardNumberElement
                    options={{ style: { base: STRIPE_BASE }, showIcon: true }}
                  />
                </div>
              </div>

              {/* Caducidad + CVC */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] font-black text-gris uppercase tracking-widest block mb-1.5">
                    Caducidad
                  </label>
                  <div className="bg-fondo border border-borde rounded-xl p-3 focus-within:border-primario transition-colors">
                    <CardExpiryElement
                      options={{ style: { base: STRIPE_BASE } }}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[9px] font-black text-gris uppercase tracking-widest block mb-1.5">
                    CVC
                  </label>
                  <div className="bg-fondo border border-borde rounded-xl p-3 focus-within:border-primario transition-colors">
                    <CardCvcElement
                      options={{ style: { base: STRIPE_BASE } }}
                    />
                  </div>
                </div>
              </div>

              {/* Guardar tarjeta */}
              <label className="flex items-center gap-3 cursor-pointer p-3 bg-primario/5 rounded-xl border border-primario/10 hover:bg-primario/10 transition-colors">
                <input
                  type="checkbox"
                  checked={guardarTarjeta}
                  onChange={(e) => setGuardarTarjeta(e.target.checked)}
                  className="w-4 h-4 accent-primario rounded"
                />
                <div>
                  <p className="text-xs font-black text-texto">
                    Guardar para futuras compras
                  </p>
                  <p className="text-[9px] text-gris font-bold">
                    Almacenado de forma segura con Stripe
                  </p>
                </div>
                <FaLock size={10} className="text-gris ml-auto shrink-0" />
              </label>
            </div>
          )}
        </div>
      )}

      {/* TRANSFERENCIA */}
      {metodo === "transferencia" && (
        <div className="bg-azul/5 border border-azul/20 rounded-3xl p-5 space-y-3">
          <p className="text-xs font-black text-azul uppercase tracking-widest">
            Datos bancarios
          </p>
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-gris">IBAN</span>
              <span className="text-[10px] font-black text-texto">
                ES12 3456 7890 1234 5678 9012
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-gris">Concepto</span>
              <span className="text-[10px] font-black text-texto">
                Reserva Horizonte Azul
              </span>
            </div>
          </div>
          <p className="text-[10px] font-bold text-azul bg-azul/10 px-3 py-2 rounded-xl">
            Confirmaremos tu reserva en 24-48h tras recibir el pago.
          </p>
        </div>
      )}

      {/* PAYPAL */}
      {metodo === "paypal" && (
        <div className="bg-naranja/5 border border-naranja/20 rounded-3xl p-5 text-center space-y-2">
          <p className="text-2xl">🅿</p>
          <p className="text-sm font-black text-texto">PayPal</p>
          <p className="text-xs font-bold text-gris">
            Serás redirigido a PayPal para completar el pago de forma segura.
          </p>
        </div>
      )}

      {/* BOTONES */}
      <div className="flex gap-3">
        <button
          onClick={onVolver}
          className="flex-1 py-4 rounded-2xl font-black text-xs uppercase border-2 border-borde text-gris hover:border-primario hover:text-primario transition-all"
        >
          Atrás
        </button>
        <button
          onClick={onPagar}
          disabled={loading}
          className="flex-1 bg-secundario text-blanco-fijo py-4 rounded-2xl font-black text-sm uppercase flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-secundario/20 hover:bg-primario transition-all"
        >
          {loading ? (
            <>
              <span className="animate-spin inline-block w-4 h-4 border-2 border-blanco-fijo/30 border-t-blanco-fijo rounded-full" />{" "}
              Procesando...
            </>
          ) : (
            <>
              <FaShoppingCart size={13} /> Pagar {precioTotal.toFixed(2)}€
            </>
          )}
        </button>
      </div>

      {/* Sello seguridad */}
      <div className="flex items-center justify-center gap-2 text-[9px] text-gris font-bold uppercase tracking-widest">
        <FaLock size={8} />
        Pago seguro con Stripe · Tus datos están protegidos
      </div>
    </div>
  );
}
