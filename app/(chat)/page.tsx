import { nanoid } from '@/lib/utils'
import { Chat } from '@/components/chat'
import { AI } from '@/lib/chat/actions'
import { auth } from '@/auth'
import { Session } from '@/lib/types'
import { getMissingKeys } from '../actions'
import { TextToEvents } from '@/components/text-to-events'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export const metadata = {
  title: 'phospho demo'
}

export default async function IndexPage() {
  const id = nanoid()
  const session = (await auth()) as Session
  const missingKeys = await getMissingKeys()

  return (
    <div className="group w-full">
      <Tabs defaultValue="chat">
        <div className="static">
          <TabsList className="flex justify-center">
            <TabsTrigger value="chat">Detect Events in chat</TabsTrigger>
            <TabsTrigger value="text">Detect Events in text</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="text">
          <div className="overflow-auto">
            <TextToEvents />
          </div>
        </TabsContent>
        <TabsContent value="chat">
          <div className="overflow-auto">
            <AI initialAIState={{ chatId: id, messages: [] }}>
              <Chat id={id} session={session} missingKeys={missingKeys} />
            </AI>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
