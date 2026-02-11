import { useState } from 'react';
import {
  FlaskConical,
  Plus,
  Play,
  StopCircle,
  Trash2,
  Code,
  CheckCircle,
  XCircle,
  Loader2,
  Clock,
  Package,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardIcon,
  CardTitle,
  CardContent,
  CardFooter,
} from '@components/base/card';
import { Button } from '@components/base/button';
import { Badge } from '@components/base/badge';
import { TextField } from '@components/base/text-field';
import { Textarea } from '@components/base/text-area';
import PageHeader from '@components/PageHeader';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@components/base/dialog';

type SandboxStatus = 'running' | 'finished' | 'error' | 'canceled';

interface Sandbox {
  id: number;
  name: string;
  script: string;
  status: SandboxStatus;
  output?: string;
  error?: string;
  libraries: string[];
  createdAt: string;
  finishedAt?: string;
}

const AVAILABLE_LIBRARIES = [
  'requests',
  'numpy',
  'pandas',
  'matplotlib',
  'beautifulsoup4',
  'pillow',
  'scikit-learn',
  'tensorflow',
  'torch',
  'opencv-python',
];

export default function SandboxPage() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newName, setNewName] = useState('');
  const [newScript, setNewScript] = useState('');
  const [selectedLibs, setSelectedLibs] = useState<string[]>([]);

  // TODO: Implement endpoint GET /api/sandbox
  const sandboxes: Sandbox[] = [
    {
      id: 1,
      name: 'Data Analysis',
      script:
        'import pandas as pd\ndf = pd.read_csv("data.csv")\nprint(df.head())',
      status: 'finished',
      output: '   id  name  value\n0   1  foo     10\n1   2  bar     20',
      libraries: ['pandas'],
      createdAt: '2 hours ago',
      finishedAt: '2 hours ago',
    },
    {
      id: 2,
      name: 'API Request',
      script:
        'import requests\nr = requests.get("https://api.example.com")\nprint(r.json())',
      status: 'running',
      libraries: ['requests'],
      createdAt: '5 minutes ago',
    },
    {
      id: 3,
      name: 'Image Processing',
      script:
        'from PIL import Image\nimg = Image.open("photo.jpg")\nimg.resize((800, 600)).save("resized.jpg")',
      status: 'error',
      error: 'FileNotFoundError: photo.jpg not found',
      libraries: ['pillow'],
      createdAt: '1 day ago',
      finishedAt: '1 day ago',
    },
    {
      id: 4,
      name: 'Web Scraping',
      script:
        'import requests\nfrom bs4 import BeautifulSoup\nhtml = requests.get("https://example.com").text\nsoup = BeautifulSoup(html, "html.parser")\nprint(soup.title.string)',
      status: 'canceled',
      libraries: ['requests', 'beautifulsoup4'],
      createdAt: '3 days ago',
      finishedAt: '3 days ago',
    },
  ];

  const handleCreateSandbox = () => {
    if (!newName.trim() || !newScript.trim()) return;
    // TODO: Implement endpoint POST /api/sandbox
    console.log('Creating sandbox:', {
      name: newName,
      script: newScript,
      libraries: selectedLibs,
    });
    setShowCreateDialog(false);
    setNewName('');
    setNewScript('');
    setSelectedLibs([]);
  };

  const toggleLibrary = (lib: string) => {
    setSelectedLibs((prev) =>
      prev.includes(lib) ? prev.filter((l) => l !== lib) : [...prev, lib],
    );
  };

  return (
    <div className='space-y-4'>
      <PageHeader
        title='Sandbox'
        icon={<FlaskConical className='w-5 h-5' />}
        action={
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className='w-4 h-4' />
            New Sandbox
          </Button>
        }
      />

      <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4'>
        {sandboxes.map((sandbox) => (
          <SandboxCard key={sandbox.id} sandbox={sandbox} />
        ))}
      </div>

      {sandboxes.length === 0 && (
        <Card>
          <CardContent className='p-12 text-center'>
            <FlaskConical className='w-16 h-16 text-muted-foreground mx-auto mb-4' />
            <p className='text-muted-foreground mb-4'>
              No sandboxes yet. Create your first sandbox!
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className='w-4 h-4' />
              New Sandbox
            </Button>
          </CardContent>
        </Card>
      )}

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <FlaskConical className='w-5 h-5 text-primary' />
              Create New Sandbox
            </DialogTitle>
            <DialogDescription>
              Write Python code to run in an isolated environment
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-4'>
            <TextField
              label='Sandbox Name'
              placeholder='My Script'
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />

            <div>
              <label className='text-sm text-muted-foreground mb-2 block'>
                Python Script
              </label>
              <Textarea
                placeholder='import requests&#10;&#10;response = requests.get("https://api.example.com")&#10;print(response.json())'
                value={newScript}
                onChange={(e) => setNewScript(e.target.value)}
                className='min-h-64 font-mono text-sm'
              />
            </div>

            <div>
              <label className='text-sm text-muted-foreground mb-3 flex items-center gap-2'>
                <Package className='w-4 h-4' />
                Select Libraries
              </label>
              <div className='grid grid-cols-2 md:grid-cols-3 gap-2'>
                {AVAILABLE_LIBRARIES.map((lib) => (
                  <Badge
                    key={lib}
                    variant={selectedLibs.includes(lib) ? 'default' : 'outline'}
                    className='cursor-pointer justify-center py-2'
                    render={(props) => (
                      <button {...props} onClick={() => toggleLibrary(lib)} />
                    )}
                  >
                    {lib}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setShowCreateDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateSandbox}>
              <Play className='w-4 h-4' />
              Create & Run
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SandboxCard({ sandbox }: { sandbox: Sandbox }) {
  const statusConfig = {
    running: {
      badge: (
        <Badge variant='warning'>
          <Loader2 className='w-3 h-3 animate-spin' />
          Running
        </Badge>
      ),
      icon: <Loader2 className='w-5 h-5 text-warning animate-spin' />,
    },
    finished: {
      badge: (
        <Badge variant='success'>
          <CheckCircle className='w-3 h-3' />
          Finished
        </Badge>
      ),
      icon: <CheckCircle className='w-5 h-5 text-success' />,
    },
    error: {
      badge: (
        <Badge variant='destructive'>
          <XCircle className='w-3 h-3' />
          Error
        </Badge>
      ),
      icon: <XCircle className='w-5 h-5 text-destructive' />,
    },
    canceled: {
      badge: <Badge variant='outline'>Canceled</Badge>,
      icon: <StopCircle className='w-5 h-5 text-muted-foreground' />,
    },
  };

  const handleStop = () => {
    // TODO: Implement endpoint POST /api/sandbox/:id/stop
    console.log('Stopping sandbox:', sandbox.id);
  };

  const handleDelete = () => {
    // TODO: Implement endpoint DELETE /api/sandbox/:id
    console.log('Deleting sandbox:', sandbox.id);
  };

  return (
    <Card className='hover:border-primary/30 transition-all'>
      <CardHeader>
        <CardIcon>{statusConfig[sandbox.status].icon}</CardIcon>
        <CardTitle>{sandbox.name}</CardTitle>
        {statusConfig[sandbox.status].badge}
      </CardHeader>

      <CardContent className='space-y-3'>
        <div className='p-3 bg-muted/30 rounded-sm border border-border'>
          <div className='flex items-center gap-2 mb-2'>
            <Code className='w-4 h-4 text-primary' />
            <span className='text-xs font-medium text-foreground'>Script</span>
          </div>
          <pre className='text-xs text-muted-foreground font-mono line-clamp-3 whitespace-pre-wrap'>
            {sandbox.script}
          </pre>
        </div>

        {sandbox.libraries.length > 0 && (
          <div className='flex flex-wrap gap-1'>
            {sandbox.libraries.map((lib) => (
              <Badge key={lib} variant='secondary' className='text-xs'>
                {lib}
              </Badge>
            ))}
          </div>
        )}

        {sandbox.output && (
          <div className='p-3 bg-success/5 rounded-sm border border-success/20'>
            <div className='text-xs font-medium text-success mb-1'>Output:</div>
            <pre className='text-xs text-foreground font-mono whitespace-pre-wrap'>
              {sandbox.output}
            </pre>
          </div>
        )}

        {sandbox.error && (
          <div className='p-3 bg-destructive/5 rounded-sm border border-destructive/20'>
            <div className='text-xs font-medium text-destructive mb-1'>
              Error:
            </div>
            <pre className='text-xs text-destructive font-mono whitespace-pre-wrap'>
              {sandbox.error}
            </pre>
          </div>
        )}

        <div className='flex items-center gap-4 text-xs text-muted-foreground'>
          <span className='flex items-center gap-1'>
            <Clock className='w-3 h-3' />
            {sandbox.createdAt}
          </span>
          {sandbox.finishedAt && <span>• Finished {sandbox.finishedAt}</span>}
        </div>
      </CardContent>

      <CardFooter className='gap-2'>
        {sandbox.status === 'running' && (
          <Button variant='destructive' size='sm' onClick={handleStop}>
            <StopCircle className='w-4 h-4' />
            Stop
          </Button>
        )}
        <Button
          variant='ghost'
          size='sm'
          onClick={handleDelete}
          className='ml-auto text-destructive hover:bg-destructive/10'
        >
          <Trash2 className='w-4 h-4' />
        </Button>
      </CardFooter>
    </Card>
  );
}
