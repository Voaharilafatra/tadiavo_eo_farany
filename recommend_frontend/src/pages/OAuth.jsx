import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'
import { FiArrowLeft } from 'react-icons/fi';

function OAuth() {
  const navigate = useNavigate();
  const { login, googleLogin, isAuthenticated, loading: authLoading } = useAuth()

  const handleSuccess = async (credentialResponse) => {
    try {
      const credential = credentialResponse.credential;

      if (!credential) {
        console.error("Credential Google manquant");
        return;
      }

      await googleLogin(credential);

      console.log("Utilisateur connecté", );

     // navigate("/dashboard", { replace: true })


    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
    }
  };
  const handleError = () => {
    console.log('Login Failed');
    alert("Impossible de se connecter avec Google.");
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-white px-4">
      <div className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-8 shadow-xl text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow-400 text-2xl font-black text-white">
          T
        </div>
        <h1 className="mb-2 text-2xl font-bold text-black">Bienvenue sur TADIAVO-EO</h1>
        <p className="mb-8 text-sm text-zinc-500">
          Connectez-vous avec votre compte Google pour continuer.
        </p>

        <div className="flex justify-center mb-6">
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleError}
            useOneTap
            shape="pill"
            theme="outline"
          />
        </div>

        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-yellow-400 transition-colors"
        >
          <FiArrowLeft /> Retour
        </button>
      </div>
    </div>
  );
}

export default OAuth;
