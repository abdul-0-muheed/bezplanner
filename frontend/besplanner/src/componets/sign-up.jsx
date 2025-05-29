  import { useState, useEffect } from 'react'
  import { createClient } from '@supabase/supabase-js'
  import { Auth } from '@supabase/auth-ui-react'
  import { ThemeSupa } from '@supabase/auth-ui-shared'
  import './sign-up.css'
import { useNavigate } from 'react-router-dom'


const supabaseUrl = 'https://xrahyljqmpmdpazbikie.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhyYWh5bGpxbXBtZHBhemJpa2llIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5NTAyNTQsImV4cCI6MjA2MjUyNjI1NH0.i_izJ7VA4kYUBOfRdw5iVW6SJ3ybCJmQafQ6ogJlcK0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);


function SignUp() {
    const [session, setSession] = useState(null)
    const navigate = useNavigate();

    useEffect(() => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session)
      })
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session)
      })
      return () => subscription.unsubscribe()
    }, [])
    useEffect(() => {
      if (session) {
        navigate("/onbroading")
    }
    }, [session, navigate])

    if (!session) {
      return (
        <div className="auth-container">
          <Auth 
            supabaseClient={supabase} 
            appearance={{ 
              theme: ThemeSupa,
              style: {
                button: { background: '#4CAF50', color: 'white' },
                anchor: { color: '#4CAF50' },
                container: { maxWidth: '100%' },
                divider: { margin: '2rem 0' },
                // Add styles for auth form
                label: { color: '#333' },
                input: { 
                  borderRadius: '4px',
                  padding: '8px',
                  border: '1px solid #ddd'
                }
              }
            }}
            providers={['google']}
            redirectTo={`${window.location.origin}/onbroading`}
            onlyThirdPartyProviders={false}
            view='sign_in'
            showLinks={true}
            localization={{
              variables: {
                sign_in: {
                  email_label: 'Email',
                  password_label: 'Password',
                  button_label: 'Sign in',
                  loading_button_label: 'Signing in ...',
                  social_provider_text: 'Sign in with {{provider}}',
                  link_text: 'Already have an account? Sign in'
                },
                sign_up: {
                  email_label: 'Email',
                  password_label: 'Create password',
                  button_label: 'Sign up',
                  loading_button_label: 'Signing up ...',
                  social_provider_text: 'Sign up with {{provider}}',
                  link_text: 'Don\'t have an account? Sign up'
                }
              }
            }}
          />
        </div>
      )
    } else {
      return null
    }  
}

export default SignUp;
