"""OpenAI credential access with a Windows vault; never persist plaintext."""
import argparse
import getpass
import os

SERVICE = 'OC-Drug-Repurposing/OpenAI'
USERNAME = 'OPENAI_API_KEY'


def vault():
    if os.name != 'nt':
        raise RuntimeError('Windows vault unavailable; use OPENAI_API_KEY in your environment')
    from keyring.backends.Windows import WinVaultKeyring
    return WinVaultKeyring()


def load_key():
    value = os.environ.get(USERNAME) or vault().get_password(SERVICE, USERNAME)
    if not value or not value.startswith('sk-'):
        raise RuntimeError('Configure OPENAI_API_KEY or the Windows credential vault')
    return value


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('action', choices=['set', 'status'])
    args = parser.parse_args()
    if args.action == 'set':
        value = getpass.getpass('OpenAI key (hidden): ')
        if not value.startswith('sk-') or len(value) < 30:
            raise SystemExit('Invalid credential format')
        vault().set_password(SERVICE, USERNAME, value)
        if vault().get_password(SERVICE, USERNAME) != value:
            raise SystemExit('Credential verification failed')
        del value
        print('Credential stored in Windows Credential Manager')
    else:
        print('Credential configured' if load_key() else 'Credential missing')


if __name__ == '__main__':
    main()
