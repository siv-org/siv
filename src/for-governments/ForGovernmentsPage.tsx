import { Head } from '../Head'
import { BlueDivider } from '../landing-page/BlueDivider'
import { Footer } from '../landing-page/Footer'
import { AboveFold } from './AboveFold'
import { AnotherOption } from './AnotherOption'
import { GiveYourVoters } from './GiveYourVoters'
import { HeaderBar } from './HeaderBar'
import { ImprovesYourProcess } from './ImprovesYourProcess'
import { TransparentProtocol } from './TransparentProtocol'

export const ForGovernmentsPage = (): JSX.Element => (
  <>
    <Head title="For Governments">
      <link href="/landing-page/typography.css" rel="stylesheet" />
    </Head>

    <main>
      <HeaderBar />
      <AboveFold />
      <ImprovesYourProcess />
      <BlueDivider />
      <AnotherOption />
      <BlueDivider />
      <TransparentProtocol />
      <BlueDivider />
      <GiveYourVoters idKey="2" />
      <BlueDivider />
      <Footer />
    </main>
  </>
)
