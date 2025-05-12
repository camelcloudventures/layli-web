import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import InviteForm from './components/invite-form'

export default function InvitePage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Accept Invitation</CardTitle>
        </CardHeader>
        <CardContent>
          <InviteForm />
        </CardContent>
      </Card>
    </div>
  )
}
