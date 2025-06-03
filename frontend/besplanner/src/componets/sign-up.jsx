import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useNavigate } from 'react-router-dom'

const supabaseUrl = 'https://xrahyljqmpmdpazbikie.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhyYWh5bGpxbXBtZHBhemJpa2llIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5NTAyNTQsImV4cCI6MjA2MjUyNjI1NH0.i_izJ7VA4kYUBOfRdw5iVW6SJ3ybCJmQafQ6ogJlcK0'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

function SignUp() {
  const [session, setSession] = useState(null)
  const navigate = useNavigate()

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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-slate-800/50 p-8 rounded-2xl border border-purple-500/20">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-2">
              Welcome to <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">BizLaunch</span>
            </h2>
            <p className="text-gray-300 mb-6">Start your business journey today</p>
          </div>
          
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              style: {
                button: {
                  background: 'linear-gradient(to right, #9333ea, #3b82f6)',
                  color: 'white',
                  borderRadius: '9999px',
                  padding: '0.75rem 1.5rem',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    background: 'linear-gradient(to right, #7e22ce, #2563eb)'
                  }
                },
                anchor: { 
                  color: '#a855f7',
                  '&:hover': {
                    color: '#9333ea'
                  }
                },
                container: { 
                  maxWidth: '100%'
                },
                divider: { 
                  margin: '1.5rem 0',
                  borderColor: 'rgba(168, 85, 247, 0.2)'
                },
                label: { 
                  color: '#e2e8f0'
                },
                input: {
                  backgroundColor: 'rgba(30, 41, 59, 0.5)',
                  borderColor: 'rgba(168, 85, 247, 0.2)',
                  borderRadius: '0.5rem',
                  padding: '0.75rem',
                  color: 'white',
                  '&:focus': {
                    borderColor: '#a855f7',
                    outline: 'none'
                  }
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
                  social_provider_text: 'Continue with {{provider}}',
                  link_text: 'Already have an account? Sign in'
                },
                sign_up: {
                  email_label: 'Email',
                  password_label: 'Create password',
                  button_label: 'Get Started',
                  loading_button_label: 'Creating your account ...',
                  social_provider_text: 'Continue with {{provider}}',
                  link_text: "Don't have an account? Create one"
                }
              }
            }}
          />
        </div>
      </div>
    )
  } else {
    return null
  }
}

export default SignUp
